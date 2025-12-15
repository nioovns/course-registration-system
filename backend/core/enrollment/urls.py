from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnrollmentSettingsViewSet

router = DefaultRouter()
router.register(r'enrollment-settings', EnrollmentSettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
