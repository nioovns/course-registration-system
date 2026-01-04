from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
from users.permissions import IsAdmin, IsStudent
from .models.EnrollmentSettings import EnrollmentSettings
from .models.Enrollment import Enrollment
from .serializers.EnrollmentSettingsSerializer import EnrollmentSettingsSerializer
from .serializers.EnrollmentSerializer import EnrollmentSerializer
from .services import withdraw_student

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

    def destroy(self, request, *args, **kwargs):
        try:
            withdraw_student(request.user.student, kwargs.get('pk'))
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"detail": e.messages}, status=status.HTTP_400_BAD_REQUEST)