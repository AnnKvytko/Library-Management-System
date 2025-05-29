from django.core.mail import send_mail
from django.db import transaction

from rest_framework import filters, status, viewsets
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend

from books.models import Book
from orders.models import Order, ORDER_STATUS_CHOICES
from orders.serializers import OrderSerializer
from users.models import User
from users.permissions import IsLibrarian, IsReader
from users.utils import safe_operation


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsLibrarian | IsReader]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'user', 'book']
    search_fields = ['user__email', 'book__title', 'status']
    ordering_fields = ['created_at', 'due_date']
    ordering = ['-created_at']

    @safe_operation
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.check_expiration()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @safe_operation
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        for order in queryset:
            order.check_expiration()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @safe_operation
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        # Only allow updating 'status' and 'weeks'
        status_value = data.get('status')
        weeks_value = data.get('weeks')

        updated = False

        if status_value and status_value in dict(ORDER_STATUS_CHOICES):
            instance.status = status_value
            updated = True
            
            if status_value == "borrowed":
                user = instance.user
                book = instance.book
                email = user.email
                title = getattr(book, 'title', 'book')
                due_date = instance.due_date.strftime('%Y-%m-%d')
                send_mail(
                    "Book was taken from library",
                    f"You successfully picked up the book \"{title}\" from Library\n"
                    f"Please return it back till {due_date}. Thank you.",
                    "noreply@library.com",
                    [email],
                    fail_silently=False,
                )


        if weeks_value is not None:
            try:
                weeks_value = int(weeks_value)
                if 1 <= weeks_value <= 12:
                    instance.weeks = weeks_value
                    instance.due_date = timezone.now() + timedelta(weeks=weeks_value)
                    updated = True
                else:
                    return Response({"error": "Weeks must be between 1 and 12."},
                                    status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({"error": "Weeks must be an integer."},
                                status=status.HTTP_400_BAD_REQUEST)

        if not updated:
            return Response({"error": "Only 'status' and 'weeks' can be updated."},
                            status=status.HTTP_400_BAD_REQUEST)

        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @safe_operation
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        
        user_id = request.data.get("user_id")
        book_id = request.data.get("book_id")

        user = User.objects.get(pk=user_id)
        book = Book.objects.get(pk=book_id)
        
        if book.amount < 1:
            return Response(
            {"detail": "This book is currently out of stock."},
            status=status.HTTP_400_BAD_REQUEST
        )
        book.amount -= 1
        book.save()

        email = user.email
        title = getattr(book, 'title', 'book')

        send_mail(
            "Book Order Created",
            f"Your order for the book \"{title}\" has been successfully created. "
            "Please pick it up from the library within 3 days. Thank you.",
            "noreply@library.com",
            [email],
            fail_silently=False,
        )
        return super().create(request, *args, **kwargs)

    @safe_operation
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
