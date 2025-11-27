from django.db import models
from django.core.exceptions import ValidationError
from course.validators import validate_time_range
from course.choices import TimeChoices, FacultyChoices, RoomChoices, DayChoices, UnitChoices

class ClassSession(models.Model):
    day = models.CharField(max_length=10, choices=DayChoices.DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    faculty = models.CharField(max_length=20, choices=FacultyChoices.FACULTY_CHOICES, default="eng")
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
