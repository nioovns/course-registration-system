from rest_framework import viewsets
from .models import EnrollmentSettings
from .serializers import EnrollmentSettingsSerializer

class EnrollmentSettingsViewSet(viewsets.ModelViewSet):
    queryset = EnrollmentSettings.objects.all()
    serializer_class = EnrollmentSettingsSerializer
    permission_classes = [IsAdmin]
