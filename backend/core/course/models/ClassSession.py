from django.db import models
from django.core.exceptions import ValidationError
from course.validators import validate_time_range

class ClassSession(models.Model):
    DAY_CHOICES = [
        ('sat', 'شنبه'),
        ('sun', 'یکشنبه'),
        ('mon', 'دوشنبه'),
        ('tue', 'سه‌شنبه'),
        ('wed', 'چهارشنبه'),
    ]

    day = models.CharField(max_length=5, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=20)

    def clean(self):
        try:
            validate_time_range(self.start_time, self.end_time)
        except ValidationError as e:
            raise e
        
    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_day_display()} {self.start_time}-{self.end_time} | کلاس {self.room}"
