from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnrollmentSettingsViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register(r'settings', EnrollmentSettingsViewSet, basename='enrollment-settings')
router.register(r'my-courses', EnrollmentViewSet, basename='student-enrollment')
urlpatterns = [
    path('', include(router.urls)),
]
