from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters, status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Book
from .serializers import BookSerializer
from users.permissions import IsGuest, IsLibrarian, IsReader
from users.utils import safe_operation


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('title')
    serializer_class = BookSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    #GET /api/books/?genre=romance
    filterset_fields = ['genre', 'publication_year', 'title', 'author']
    #GET /api/books/?search=orwell
    search_fields = ['title', 'genre', 'publication_year', 'author__first_name', 'author__last_name']
    #GET /api/books/?ordering=-publication_year
    ordering_fields = ['title', 'publication_year',]
    ordering = ['title']

    def get_permissions(self):

        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        elif self.action in ['favorite', 'unfavorite', 'favorites']:
            permission_classes = [IsReader]
        else:
            permission_classes = [IsLibrarian]

        return [permission() for permission in permission_classes]

    @safe_operation
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @safe_operation
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @safe_operation
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @safe_operation
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @safe_operation
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"detail": "Book deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=["post"])
    def favorite(self, request, pk=None):
        book = self.get_object()
        request.user.favorite_books.add(book)
        return Response({"message": "added"})
    
    @action(detail=True, methods=["post"])
    def unfavorite(self, request, pk=None):
        book = self.get_object()
        request.user.favorite_books.remove(book)
        return Response({"message": "removed"})
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def favorites(self, request):
        books = request.user.favorite_books.all()
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data)
