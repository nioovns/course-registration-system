from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
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

    @property
    def is_student(self):
        return self.role == self.Roles.STUDENT

    @property
    def is_professor(self):
        return self.role == self.Roles.PROFESSOR

    @property
    def is_admin_role(self):
        return self.role == self.Roles.ADMIN or self.is_superuser

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    student_id = models.CharField(
        max_length=20,
        unique=True,
        verbose_name=_("Student ID")
    )
    entry_year = models.IntegerField(verbose_name=_("Entry Year"), null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    entry_year = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"


class Professor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='professor')
    professor_code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name=_("Professor Code")
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"