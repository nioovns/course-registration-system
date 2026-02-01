from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status, viewsets
from course.serializers.CourseSerializer import CourseSerializer
from course.services.AdminServices import AdminService
from course.models.Course import Course
from course.services.CourseFilters import CourseFilter
from users.permissions import IsAdmin, IsStudent, IsProfessor


class CourseViewSet(viewsets.ViewSet):

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdmin | IsStudent | IsProfessor]
        else:
            permission_classes = [IsAdmin]

        return [permission() for permission in permission_classes]

    service = AdminService()

    def list(self, request):
        queryset = self.service.list_courses(user=request.user)
        filtered = CourseFilter.apply(queryset, request.query_params)
        serializer = CourseSerializer(filtered, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        course = self.service.get_course(pk, user=request.user)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    def create(self, request):
        course = self.service.create_course(request.data)
        serializer = CourseSerializer(course)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # PUT
    def update(self, request, pk=None):
        get_object_or_404(Course, pk=pk)
        course = self.service.update_course(pk, request.data)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    # PATCH
    def partial_update(self, request, pk=None):
        get_object_or_404(Course, pk=pk)
        course = self.service.update_course(pk, request.data, partial=True)
        serializer = CourseSerializer(course)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        get_object_or_404(Course, pk=pk)
        self.service.delete_course(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)