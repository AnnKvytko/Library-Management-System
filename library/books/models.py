import uuid
from django.db import models
from authors.models import Author 

GENRE_CHOICES = [
    ('fiction', 'Fiction'),
    ('non_fiction', 'Non-Fiction'),
    ('fantasy', 'Fantasy'),
    ('science_fiction', 'Science Fiction'),
    ('mystery', 'Mystery'),
    ('thriller', 'Thriller'),
    ('romance', 'Romance'),
    ('horror', 'Horror'),
    ('historical_fiction', 'Historical Fiction'),
    ('biography', 'Biography'),
    ('autobiography', 'Autobiography'),
    ('self_help', 'Self-Help'),
    ('philosophy', 'Philosophy'),
    ('poetry', 'Poetry'),
    ('young_adult', 'Young Adult'),
    ('children', "Children's Literature"),
    ('graphic_novel', 'Graphic Novel'),
    ('classic', 'Classic Literature'),
    ('dystopian', 'Dystopian'),
    ('crime', 'Crime'),
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