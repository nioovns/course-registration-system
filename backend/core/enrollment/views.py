from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdmin, IsStudent
from .models import  EnrollmentSettings
from .serializers import  EnrollmentSettingsSerializer
from .serializers.EnrollmentSettingsSerializer import EnrollmentSerializer

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
        return EnrollmentSerializer.objects.filter(student=self.request.user.student).select_related('course', 'course__professor')