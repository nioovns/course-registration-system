from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnrollmentSettingsViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register(r'enrollment-settings', EnrollmentSettingsViewSet)
router.register(r'settings', EnrollmentSettingsViewSet, basename='enrollment-settings')

router.register(r'my-courses', EnrollmentViewSet, basename='enrollment')
urlpatterns = [
    path('', include(router.urls)),
]
