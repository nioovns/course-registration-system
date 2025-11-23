from django.core.exceptions import ValidationError
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from course.models.Course import Course

class AdminService:
    def list_courses(self):
        return Course.objects.all()
    
    def get_course(self, course_id):
        return get_object_or_404(Course, id=course_id)
