import uuid
from datetime import timedelta

from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.urls import reverse

from users.models import User
from books.models import Book

ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),  # User ordered but hasn't taken the book yet
    ('borrowed', 'Borrowed'),  # User took the book
    ('returned', 'Returned'),  # Book has been returned
]

class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="orders")
    book = models.ForeignKey(Book, on_delete=models.PROTECT, related_name="orders")
    status = models.CharField(max_length=10, choices=ORDER_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    weeks = models.PositiveIntegerField(default=3)
    due_date = models.DateTimeField(null=True, blank=True)

    def clean(self):
        if self.status == 'returned' and self.status != 'borrowed':
            raise ValidationError("An order must be 'borrowed' before it can be marked as 'returned'.")

    def save(self, *args, **kwargs):
        """Calculate due date based on weeks."""
        if self.weeks:
            self.due_date = self.created_at + timedelta(weeks=self.weeks)
        super(Order, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} - {self.status}"

    def get_absolute_url(self):
        return reverse('order_detail', kwargs={'order_id': self.id})

