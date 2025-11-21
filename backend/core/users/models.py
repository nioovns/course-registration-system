from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # انتخاب نقش‌ها (Roles)
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('student', 'Student'),
        ('professor', 'Professor'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')

    # فیلدهای اختصاصی (Optional)
    student_id = models.CharField(max_length=20, blank=True, null=True)
    professor_code = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"