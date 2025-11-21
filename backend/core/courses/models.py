from django.db import models
from django.conf import settings


class Course(models.Model):
    # نام درس
    name = models.CharField(max_length=100)

    # کد درس -  یکتا
    course_code = models.CharField(max_length=20, unique=True)

    # ظرفیت کلاس - فقط اعداد مثب
    capacity = models.PositiveIntegerField()

    # استاد درس - ارتباط با جدول کاربران
    # فقط کاربرانی که نقش 'professor' دارند قابل انتخاب هستند
    professor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='courses_taught',
        limit_choices_to={'role': 'professor'}
    )

    # زمان برگزاری (مثال: Saturday 14:00-16:00)
    schedule = models.CharField(max_length=100)

    # مکان برگزاری (مثال: Room 301)
    location = models.CharField(max_length=50)

    # پیش‌نیازها - ارتباط چند به چند با خودِ درس
    # blank=True یعنی ممکن است درسی پیش‌نیاز نداشته باشد
    prerequisites = models.ManyToManyField(
        'self',
        symmetrical=False,
        blank=True,
        related_name='required_for'
    )

    # زمان ایجاد و ویرایش رکورد (جهت اطلاع سیستم)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course_code} - {self.name}"