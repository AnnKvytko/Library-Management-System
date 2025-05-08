from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, status, filters
from rest_framework.response import Response

from .models import Author
from .serializers import AuthorSerializer
from users.permissions import IsGuest, IsReader, IsLibrarian 
from users.utils import safe_operation


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().order_by('last_name', 'first_name')
    serializer_class = AuthorSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name','nationality']
    filterset_fields = ['nationality', 'date_of_birth', 'last_name']
    ordering_fields = ['first_name', 'last_name', 'date_of_birth']
    ordering = ['last_name']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsGuest | IsReader | IsLibrarian]
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
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @safe_operation
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @safe_operation
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"detail": "Author deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
