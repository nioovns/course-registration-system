from django.db import models
from django.core.exceptions import ValidationError
from course.validators import validate_time_range
from course.choices import FacultyChoices, UnitChoices, DayChoices
# 1. ایمپورت صحیح مدل استاد از اپ users
from users.models import Professor


class ClassSession(models.Model):
    day = models.CharField(max_length=10, choices=DayChoices.DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    faculty = models.CharField(max_length=20, choices=FacultyChoices.FACULTY_CHOICES, default="eng")
    room = models.CharField(max_length=20)
    class Meta:
        app_label = 'course'
        verbose_name = 'Class Session'
        verbose_name_plural = 'Class Sessions'

    def clean(self):
        validate_time_range(self.start_time, self.end_time)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_day_display()} {self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')} | Room {self.room}"


class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    units = models.IntegerField(choices=UnitChoices.UNIT_CHOICES, default=1)

    capacity = models.PositiveIntegerField()

    sessions = models.ManyToManyField(ClassSession, related_name="courses")

    professor = models.ForeignKey(
        Professor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses'
    )

    prerequisites = models.ManyToManyField(
        "self",
        symmetrical=False,
        blank=True,
        related_name="required_for"
    )

    class Meta:
        app_label = 'course'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        prof_name = self.professor.last_name if self.professor else "No Prof"
        return f"{self.name} ({self.code}) - {prof_name}"

    @property
    def is_full(self):
        if hasattr(self, 'enrollments'):
            return self.enrollments.count() >= self.capacity
        return False

    def delete(self, *args, **kwargs):
        self.sessions.all().delete()
        super().delete(*args, **kwargs)