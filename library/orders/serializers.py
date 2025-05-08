from rest_framework import serializers

from .models import Order, ORDER_STATUS_CHOICES, User, Book
from books.serializers import BookTitleSerializer
from users.serializers import UserEmailSerializer


class OrderSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=ORDER_STATUS_CHOICES, default='pending', read_only=True)
    due_date = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    book = BookTitleSerializer(read_only=True)
    user = UserEmailSerializer(read_only=True)

    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), write_only=True, source='book')
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True, source='user')

    class Meta:
        model = Order
        fields = ['id', 'user', 'user_id', 'book', 'book_id', 'status', 'created_at', 'weeks', 'due_date']
        read_only_fields = ['id','created_at']

    def validate_weeks(self, value):
        if not 1 <= value <= 12:
            raise serializers.ValidationError("Weeks must be between 1 and 12.")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data.pop('user_id', None)
        data.pop('book_id', None)
        return data
