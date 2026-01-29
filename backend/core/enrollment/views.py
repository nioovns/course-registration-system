from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from users.permissions import IsAdmin, IsStudent, IsProfessor
from .models.EnrollmentSettings import EnrollmentSettings
from .models.Enrollment import Enrollment
from .serializers.EnrollmentSettingsSerializer import EnrollmentSettingsSerializer
from .serializers.EnrollmentSerializer import EnrollmentSerializer
from .services import withdraw_student, professor_remove_student
from enrollment.serializers.EnrollmentSerializer import ProfessorEnrollmentSerializer
from course.models.Course import Course
class EnrollmentSettingsViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentSettings.objects.all()
    serializer_class = EnrollmentSettingsSerializer
    permission_classes = [IsAdmin]

class EnrollmentViewSet(mixins.CreateModelMixin,
                        mixins.ListModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student'):
            return Enrollment.objects.filter(student=user.student).select_related('course', 'course__professor')
        return Enrollment.objects.none()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user.student)

    def destroy(self, request, *args, **kwargs):
        course_code_lookup = kwargs.get('pk')

        enrollment = get_object_or_404(
            Enrollment,
            student=request.user.student,
            course__code=course_code_lookup
        )

        try:
            withdraw_student(request.user.student, enrollment.id)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ProfessorEnrollmentViewSet(mixins.ListModelMixin,
                                 viewsets.GenericViewSet):
    serializer_class = ProfessorEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsProfessor]
    def get_queryset(self):
        course_id = self.kwargs.get('course_id')

        course = get_object_or_404(
            Course,
            id=course_id,
            professor=self.request.user  
        )

        return Enrollment.objects.filter(
            course=course,
            status=Enrollment.Status.ENROLLED
        ).select_related('student','student__user')

    def destroy(self, request, course_id=None, student_db_id=None):
        try:
            professor_remove_student(
                professor = self.request.user,
                course_id = course_id,
                student_id = student_db_id
            )
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)
