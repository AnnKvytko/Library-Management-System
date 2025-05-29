from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes

from rest_framework import generics, status, viewsets, serializers
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile, User
from .permissions import IsReader, IsLibrarian
from .serializers import ProfileSerializer, RegisterSerializer, UserSerializer
from .utils import safe_operation


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    @safe_operation
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        email = user.email
        role = getattr(user, 'role', 'user')

        try:
            send_mail(
                "Library registration",
                f"Congratulations! You've been successfully registered at the Library as {role}.",
                "noreply@library.com",
                [email],
                fail_silently=False,
            )
        except Exception as e:
            pass

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        response_data = {
            "user": self.get_serializer(user).data,
            "refresh": str(refresh),
            "access": str(access_token),
            "message": "Welcome email was sent.",
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    
class LogoutView(APIView):
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Logout successful."},
                            status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Invalid or expired refresh token."},
                            status=status.HTTP_400_BAD_REQUEST)
                            """

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_permissions(self):
        if self.action == 'retrieve':
            permission_classes = [IsReader | IsLibrarian]
        elif self.action == 'list':
            permission_classes = [IsLibrarian]
        else:
            permission_classes = [IsReader]
    
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


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [ IsLibrarian | IsAdminUser]


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_link = f"http://localhost:8000/password-reset-confirm/{uid}/{token}/"
            send_mail(
                "Password Reset Request",
                f"Click the link to reset your password: {reset_link}",
                "noreply@library.com",
                [email],
                fail_silently=False,
            )
        return Response({"message": "If the email exists, a reset link was sent."})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    class InputSerializer(serializers.Serializer):
        uidb64 = serializers.CharField()
        token = serializers.CharField()
        new_password = serializers.CharField(min_length=8, write_only=True)

    def post(self, request, uidb64=None, token=None):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uidb64 = serializer.validated_data["uidb64"]
        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "Invalid user identifier (UID)."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        # Set the new password safely
        user.set_password(new_password)
        user.save()

        # Generate new JWT tokens for the user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            "message": "Password has been reset successfully.",
            "access": access_token,
            "refresh": refresh_token,
        }, status=status.HTTP_200_OK)