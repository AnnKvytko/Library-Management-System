from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, ORDER_STATUS_CHOICES
from .serializers import OrderSerializer
from users.permissions import IsReader, IsLibrarian
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
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @safe_operation
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
