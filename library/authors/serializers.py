from rest_framework import serializers
from .models import Author
from datetime import date

class AuthorSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Author
        fields = [
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
            'date_of_death',
            'description',
            'nationality',
            'photo',
        ]

    def validate(self, data):
        dob = data.get('date_of_birth')
        dod = data.get('date_of_death')
        if dob and dod and dod < dob:
            raise serializers.ValidationError("Date of death cannot be before date of birth.")
        if dob and dob > date.today():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        if dod and dod > date.today():
            raise serializers.ValidationError("Date of death cannot be in the future.")
        return data
        
    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty or whitespace.")
        return value.strip().title()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty or whitespace.")
        return value.strip().title()

    def validate_description(self, value):
        if value and len(value) > 500:
            raise serializers.ValidationError("Description must be 500 characters or fewer.")
        return value.strip() if value else value
