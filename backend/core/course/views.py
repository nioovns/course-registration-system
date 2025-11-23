from rest_framework.response import Response
from rest_framework import status, viewsets
from course.serializers.CourseSerializer import CourseSerializer
from course.serializers.ClassSessionSerializer import ClassSessionSerializer
from course.services.AdminServices import AdminService

class CourseViewSet(viewsets.ViewSet):
    service = AdminService()
    
    def list(self, request):
        courses = self.service.list_courses()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        course = self.service.get_course(pk)
        serializer = CourseSerializer(course)
        return Response(serializer.data)
