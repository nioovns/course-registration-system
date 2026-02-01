from django.shortcuts import get_object_or_404
from course.models.Course import Course
from course.serializers.CourseSerializer import CourseSerializer


class AdminService:
    def list_courses(self, user=None):
        queryset = Course.objects.all()

        if user and user.role == user.Roles.PROFESSOR:
            queryset = queryset.filter(professor=user)
            
        return queryset



    def get_course(self, course_id, user=None):
        course = get_object_or_404(Course, id=course_id)
        
        if user and user.role == user.Roles.PROFESSOR:
            if course.professor != user:
                raise PermissionDenied("شما اجازه دسترسی به این درس را ندارید")
            
        return course

    def create_course(self, data):
        serializer = CourseSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save()
        return course

    def update_course(self, course_id, data, partial=False):
        course = get_object_or_404(Course, id=course_id)

        serializer = CourseSerializer(instance=course, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        return serializer.save()

    def delete_course(self, course_id):
        course = get_object_or_404(Course, id=course_id)
        course.delete()