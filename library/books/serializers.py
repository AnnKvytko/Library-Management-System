from datetime import datetime
from rest_framework import serializers
from .models import Book
from authors.serializers import AuthorSerializer
from authors.models import Author


class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(), write_only=True, source='author'
    )
    photo = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'publication_year',
            'description',
            'amount',
            'genre',
            'author',        # read-only nested representation
            'author_id',     # to write via POST/PUT
            'photo',
        ]
        extra_kwargs = {
        'genre': {'help_text': 'Choose a genre or write your own.'},
        'title': {'required': True},
        }

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError("Title cannot be empty or whitespace.")
        return value.strip().capitalize()

    def validate_publication_year(self, value):
        current_year = datetime.now().year
        if value and (value < 0 or value > current_year):
            raise serializers.ValidationError(f"Publication year must be between 0 and {current_year}.")
        return value

    def validate_amount(self, value):
        if value < 0:
            raise serializers.ValidationError("Amount must be zero or positive.")
        return value

    def validate_genre(self, value):
        valid_genres = [choice[0] for choice in self.Meta.model._meta.get_field('genre').choices]
        if value not in valid_genres:
            raise serializers.ValidationError(
                f"Invalid genre. Choose one of: {', '.join(valid_genres)}."
            )
        return value

    def validate_description(self, value):
        if value and len(value) > 500:
            raise serializers.ValidationError("Description must be 500 characters or fewer.")
        return value.strip() if value else value

class BookTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['title']