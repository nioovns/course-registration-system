from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin, IsStudent
from .models.EnrollmentSettings import EnrollmentSettings
from .models.Enrollment import Enrollment
from .serializers.EnrollmentSettingsSerializer import EnrollmentSettingsSerializer
from .serializers.EnrollmentSerializer import EnrollmentSerializer


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
            return Enrollment.objects.filter(student=user.student).select_related('course')

        return Enrollment.objects.none()