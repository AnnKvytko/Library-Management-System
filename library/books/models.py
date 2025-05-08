import uuid
from django.db import models
from authors.models import Author 

GENRE_CHOICES = [
    ('autobiography', 'Autobiography'),
    ('biography', 'Biography'),
    ('children', "Children's Literature"),
    ('classic', 'Classic Literature'),
    ('crime', 'Crime'),
    ('detective', 'Detective'),
    ('dystopian', 'Dystopian'),
    ('fantasy', 'Fantasy'),
    ('fiction', 'Fiction'),
    ('graphic_novel', 'Graphic Novel'),
    ('historical_fiction', 'Historical Fiction'),
    ('horror', 'Horror'),
    ('mystery', 'Mystery'),
    ('non_fiction', 'Non-Fiction'),
    ('philosophy', 'Philosophy'),
    ('poetry', 'Poetry'),
    ('romance', 'Romance'),
    ('science_fiction', 'Science Fiction'),
    ('self_help', 'Self-Help'),
    ('thriller', 'Thriller'),
    ('young_adult', 'Young Adult'),
]

class Book(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100, null=False)
    publication_year = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    amount = models.PositiveIntegerField(default=10)
    genre = models.CharField(max_length=100, choices=GENRE_CHOICES, null=False)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='book_photos/', null=True, blank=True)

    class Meta:
        verbose_name = "Book"
        verbose_name_plural = "Books"
        indexes = [
            models.Index(fields=['author']),
            models.Index(fields=['genre']),
            models.Index(fields=['publication_year']),
        ]

    def __repr__(self):
        return f"Book(id='{self.id}', title='{self.title}', author='{self.author}', publication_year={self.publication_year}, amount={self.amount})"

    def __str__(self):
        author = f"{self.author.first_name} {self.author.last_name}" if self.author else "Unknown Author"
        return f"{self.title} by {author}"