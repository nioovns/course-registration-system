from django.db import models

class ClassSession(models.Model):
    DAY_CHOICES = [
        ('sat', 'شنبه'),
        ('sun', 'یکشنبه'),
        ('mon', 'دوشنبه'),
        ('tue', 'سه‌شنبه'),
        ('wed', 'چهارشنبه'),
        ('thu', 'پنج‌شنبه'),
    ]

    day = models.CharField(max_length=5, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.get_day_display()} {self.start_time}-{self.end_time} | کلاس {self.room}"
