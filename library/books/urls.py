from rest_framework.routers import DefaultRouter
from .views import BookViewSet

router = DefaultRouter()
router.register(r'', BookViewSet)

urlpatterns = router.urls