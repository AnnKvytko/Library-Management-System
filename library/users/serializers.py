from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User, ROLE_CHOICES, Profile, Address

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=ROLE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'role') 
        extra_kwargs = {
            'role': {'required': True}, 
        }

    def validate(self, attrs):
        self._check_password_match(attrs)
        return attrs

    def _check_password_match(self, attrs):
        """Ensure the password fields match."""
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords didn't match."})
    
    def create(self, validated_data):
        """Create and return a new user instance."""
        validated_data.pop('password2', None)

        role = validated_data['role']
        is_staff = role.lower() == 'librarian'

        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role'],
            is_staff=is_staff,
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id','country', 'city', 'street', 'street_number']

class ProfileSerializer(serializers.ModelSerializer):
    address = AddressSerializer(required=False)

    class Meta:
        model = Profile
        fields = ['id', 'first_name', 'last_name', 'phone', 'address', 'photo']
        read_only_fields = ['id']

    def create(self, validated_data):
        address_data = validated_data.pop('address', None)
        user = self.context['request'].user

        if Profile.objects.filter(user=user).exists():
            raise serializers.ValidationError("Profile already exists.")

        if user.role.lower() != "reader":
            raise serializers.ValidationError("Only users with the 'reader' role can create a profile.")

        address_instance = None
        if address_data:
            address_instance = Address.objects.create(**address_data)

        profile = Profile.objects.create(user=user, address=address_instance, **validated_data)
        return profile
    
    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Update or create address
        if address_data:
            if instance.address:
                for attr, value in address_data.items():
                    setattr(instance.address, attr, value)
                instance.address.save()
            else:
                address = Address.objects.create(**address_data)
                instance.address = address

        instance.save()
        return instance


class UserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password', 'user_permissions', 'groups']
        read_only_fields = ['user_id', 'created_at', 'updated_at']
