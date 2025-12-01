from django.db import models
from .ClassSession import ClassSession
from course.choices import UnitChoices
from users.models import User
class Course(models.Model):
    
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=False)
    unit = models.IntegerField(choices=UnitChoices.UNIT_CHOICES, default=1)
    capacity = models.PositiveIntegerField()

    sessions = models.ManyToManyField(ClassSession, related_name="courses")
    professor = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': User.Roles.PROFESSOR},
        related_name='courses'
    )
    prerequisites = models.ManyToManyField(
        "self",
        symmetrical=False,
        blank=True,
        related_name="required_for"
    )

    def __str__(self):
        return f"{self.name} ({self.code})"
