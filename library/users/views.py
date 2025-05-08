from rest_framework import generics, status, viewsets
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
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    @safe_operation
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        response_data = {
            "user": self.get_serializer(user).data,
            "refresh": str(refresh),
            "access": str(access_token),
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