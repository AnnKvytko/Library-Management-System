from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
from .models import Order

@shared_task
def check_expired_orders_task():
    now = timezone.now()
    orders = Order.objects.filter(status__in=['pending', 'borrowed'])

    updated_count = 0
    for order in orders:
        if order.due_date and order.due_date < now:
            user_email = order.user.email
            book_title = order.book.title
            if order.status == 'borrowed':
                order.status = 'expired'
                send_mail(
                    subject='Library : Book Due Expired',
                    message=f"Dear user,\n Your order for the book \"{book_title}\" is expired after {order.due_date.strftime('%Y-%m-%d')}.\nPlease return the book to th library or extend your reading term.Thank you for understanding.",
                    from_email='library@example.com',
                    recipient_list=[user_email],
                    fail_silently=True,
                )
            elif order.status == 'pending':
                order.status = 'closed'
                send_mail(
                    subject='Library : Book Due Expired',
                    message=f"Dear user,\n Your order for the book \"{book_title}\" was closed as due date {order.due_date.strftime('%Y-%m-%d')} was expired.\nThank you for understanding.",
                    from_email='library@example.com',
                    recipient_list=[user_email],
                    fail_silently=True,
                )
            order.save()
            updated_count += 1

    return f"Successfully updated {updated_count} expired orders."


@shared_task
def send_due_soon_reminders_task():
    now = timezone.now()
    three_days_later = now + timedelta(days=3)

    orders = Order.objects.filter(
        status='borrowed',
        due_date__lte=three_days_later,
        due_date__gt=now  
    )

    notified_count = 0

    for order in orders:
        user_email = order.user.email
        book_title = order.book.title

        send_mail(
            subject='Library Reminder: Book Due Soon',
            message=f"Dear user,\nThis is a reminder that the book \"{book_title}\" is due on {order.due_date.strftime('%Y-%m-%d')}. Please return it on time.\nThank you.",
            from_email='library@example.com',
            recipient_list=[user_email],
            fail_silently=True,
        )

        notified_count += 1

    return f"Sent {notified_count} due soon reminders."
