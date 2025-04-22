from django.urls import path
from .views import RegisterView, CreateProfileView, ProfileDetailUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('profile/create/', CreateProfileView.as_view(), name='create-profile'),
    path('profile/', ProfileDetailUpdateView.as_view(), name='profile-detail-update'),
]