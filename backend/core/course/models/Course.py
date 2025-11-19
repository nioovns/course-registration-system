from django.db import models
from .ClassSession import ClassSession

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField()

    sessions = models.ManyToManyField(ClassSession, related_name="courses")

    prerequisites = models.ManyToManyField(
        "self",
        symmetrical=False,
        blank=True,
        related_name="required_for"
    )

    def __str__(self):
        return f"{self.name} ({self.code})"
