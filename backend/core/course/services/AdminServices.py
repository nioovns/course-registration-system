from django.core.exceptions import ValidationError
from rest_framework.exceptions import NotFound
from django.shortcuts import get_object_or_404
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from course.serializers.CourseSerializer import CourseSerializer


class AdminService:
    def list_courses(self):
        return Course.objects.all()
    
    def get_course(self, course_id):
        return get_object_or_404(Course, id=course_id)

    def create_course(self, data):
        serializer = CourseSerializer(data=data)
        serializer.is_valid(raise_exception=True)  
        course = serializer.save()  
        return course
    
    def update_course(self, course_id, data):
        course = get_object_or_404(Course, id=course_id)
        serializer = CourseSerializer(instance=course, data=data, partial=True)  
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    def delete_course(self, course_id):
        course = get_object_or_404(Course, id=course_id)
        course.delete()
        