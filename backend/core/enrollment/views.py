from rest_framework import viewsets
from enrollment.models.EnrollmentSettings import EnrollmentSettings
from enrollment.serializers.EnrollmentSettingsSerializer import EnrollmentSettingsSerializer

class EnrollmentSettingsViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentSettings.objects.all()
    serializer_class = EnrollmentSettingsSerializer
    permission_classes = [IsAdmin]
