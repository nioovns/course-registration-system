from django.db import models

from course.models.Course import Course
from users.models import Student


class Enrollment(models.Model):
    class Status(models.TextChoices):
        ENROLLED = 'enrolled', 'ثبت‌نام شده'
        PASSED = 'passed', 'پاس شده'
        FAILED = 'failed', 'رد شده'
        DROPPED = 'dropped', 'حذف شده'

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ENROLLED
    )
    grade = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.student_id} - {self.course.code} ({self.status})"