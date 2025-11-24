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
        professor_code = models.CharField(
            max_length=20,
            blank=True,
            null=True,
            unique=True,
            verbose_name=_("Professor Code"),
            help_text=_("Required for professors")
        )

        @property
        def is_student(self):
            return self.role == self.Roles.STUDENT

        @property
        def is_professor(self):
            return self.role == self.Roles.PROFESSOR

        @property
        def is_admin_role(self):
            return self.role == self.Roles.ADMIN or self.is_superuser
