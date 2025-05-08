import uuid
from datetime import timedelta

from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.urls import reverse

from users.models import User
from books.models import Book


ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),    # User ordered but hasn't taken the book yet
    ('borrowed', 'Borrowed'),  # User took the book
    ('returned', 'Returned'),  # Book has been returned
    ('expired', 'Expired'),    # User did not return a book on time
    ('closed', 'Closed'),      # After user returned a book or did not take any book
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
        now = timezone.now()

        if self._state.adding:
            self.status = 'pending'
            self.due_date = now + timedelta(days=3)

        elif self.status == 'borrowed':
            self.due_date = now + timedelta(weeks=self.weeks)

        elif self.status == 'pending' and self.due_date is None:
            self.due_date = now + timedelta(days=3)

        elif self.status == 'returned':
            self.status = 'closed'

        super().save(*args, **kwargs)

    def check_expiration(self):
        """Automatically update status if due_date has passed."""
        if self.due_date and self.due_date < timezone.now():
            if self.status == 'borrowed':
                self.status = 'expired'
                self.save()
            elif self.status == 'pending':
                self.status = 'closed'
                self.save()

    class Meta:
        verbose_name = "Order"
        verbose_name_plural = "Orders"
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.id} - {self.status}"

    def get_absolute_url(self):
        return reverse('order_detail', kwargs={'order_id': self.id})

