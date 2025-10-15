from rest_framework.routers import DefaultRouter
from .views import BookViewSet, FavoriteBooksViewSet, ReadBooksViewSet

router = DefaultRouter()
router.register(r'', BookViewSet)
router.register(r'favorites', FavoriteBooksViewSet, basename='favorite-books')
router.register(r'read', ReadBooksViewSet, basename='read-books')

urlpatterns = router.urls