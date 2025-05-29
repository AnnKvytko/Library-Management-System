from django.core.management.base import BaseCommand
from django_celery_beat.models import PeriodicTask, IntervalSchedule
import json

class Command(BaseCommand):
    help = 'Create or update the periodic task to check expired orders daily.'

    def handle(self, *args, **kwargs):
        schedule, _ = IntervalSchedule.objects.get_or_create(
            every=1,
            #period=IntervalSchedule.DAYS,
            period=IntervalSchedule.MINUTES,
        )

        expired_task, created1 = PeriodicTask.objects.update_or_create(
            name='Check expired orders',
            defaults={
                'interval': schedule,
                'task': 'orders.tasks.check_expired_orders_task',
                'args': json.dumps([]),
            }
        )

        reminder_task, created2 = PeriodicTask.objects.update_or_create(
            name='Send due soon email reminders',
            defaults={
                'interval': schedule,
                'task': 'orders.tasks.send_due_soon_reminders_task',
                'args': json.dumps([]),
            }
        )
        
        self.stdout.write(self.style.SUCCESS(
            f"{'Created' if created1 else 'Updated'}: {expired_task.name}"
        ))
        self.stdout.write(self.style.SUCCESS(
            f"{'Created' if created2 else 'Updated'}: {reminder_task.name}"
        ))
