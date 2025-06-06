"""
URL configuration for library project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import PasswordResetConfirmView, PasswordResetRequestView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('accounts/', include(('allauth.socialaccount.urls', 'socialaccount'), namespace='socialaccount')),
    path("custom-login/", TemplateView.as_view(template_name="login.html"), name="custom-login"),
    #path('accounts/', include('allauth.socialaccount.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain'), #login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('api/logout/', LogoutView.as_view(), name='auth_logout'),
    path('api/users/', include('users.urls')),
    path('api/books/', include('books.urls')),
    path('api/authors/', include('authors.urls')),
    path('api/orders/', include('orders.urls')),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset-confirm/<str:uidb64>/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
