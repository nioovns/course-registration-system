from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

class users(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        STUDENT = 'student', _('Student')
        PROFESSOR = 'professor', _('Professor')

        role = models.CharField(
            max_length=10,
            choices=Roles.choices,
            default=Roles.STUDENT,
            verbose_name=_("User Role")
        )
        student_id = models.CharField(
            max_length=20,
            blank=True,
            null=True,
            unique=True,
            verbose_name=_("Student ID"),
            help_text=_("Required for students")
        )