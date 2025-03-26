import os
import uuid
from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError


def author_photo_upload_to(instance, filename):
    extension = filename.split('.')[-1]
    filename = f"{slugify(instance.first_name)}_{slugify(instance.last_name)}.{extension}"
    return os.path.join('author_photos/', filename)

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=50, null=False, default = "Unknown")
    last_name = models.CharField(max_length=50, null=False, default = "Author")
    date_of_birth = models.DateField(null=True, blank=True)
    date_of_death = models.DateField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True)
    photo = models.ImageField(upload_to=author_photo_upload_to, null=True, blank=True, verbose_name='Author Photo')

    class Meta:
        verbose_name = "Author"
        verbose_name_plural = "Authors"

    def __repr__(self):
        return f"Author(id={self.id}, first_name={self.first_name}, last_name={self.last_name})"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def clean(self):
        if self.date_of_birth and self.date_of_death:
            if self.date_of_death < self.date_of_birth:
                raise ValidationError("Date of death cannot be before date of birth.")
