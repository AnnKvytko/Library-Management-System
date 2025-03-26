import uuid
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

ROLE_CHOICES = [
    ('reader', 'Reader'),
    ('librarian', 'Librarian'),
    ('guest', 'Guest'),
]

#class Role(models.Model):
#    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#    name = models.CharField(max_length=50, choices=ROLE_CHOICES, null=False)
#    class Meta:
#        verbose_name = "Role"    
#    def __str__(self):
#        return str(self.name)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=30, null=False, unique=True)
    email = models.EmailField(unique=True, null=False, max_length=255)
    password = models.CharField(max_length=255)
    role =  models.CharField(max_length=10, choices=ROLE_CHOICES, null=False, default='guest', blank=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def set_password(self, raw_password):
        """Hashes the password before saving."""
        super().set_password(raw_password)

    def __str__(self):
        return str(self.username)

class Address(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    country = models.CharField(max_length=100, null=False)
    city = models.CharField(max_length=100, null=False)
    street = models.CharField(max_length=100, null=False)
    street_number = models.CharField(max_length=5, null=False)

    class Meta:
        verbose_name = "Address"

    def __str__(self):
        return f"{self.country}, {self.city}, {self.street} {self.street_number}"

class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    phone = models.CharField(max_length=20, null=True, blank=True)
    address = models.OneToOneField(Address, on_delete=models.CASCADE, null=True, blank=True, related_name="profiles")
    photo = models.ImageField(upload_to="profile_photos/", null=True, blank=True)

    def clean(self):
        """Ensure only users with the 'reader' role can create a profile."""
        if self.user.role.lower() != "reader":
            raise ValidationError("Only users with the 'reader' role can create a profile.")

    def save(self, *args, **kwargs):
        """Run validation before saving."""
        self.clean()
        super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __str__(self):
        return f"{self.first_name} {self.last_name}'s Profile"
