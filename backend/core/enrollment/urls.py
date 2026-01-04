from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnrollmentViewSet, EnrollmentSettingsViewSet
router = DefaultRouter()
router.register(r'settings', EnrollmentSettingsViewSet, basename='enrollment-settings')
router.register(r'my-courses', EnrollmentViewSet, basename='enrollment')
urlpatterns = [
    path('', include(router.urls)),
]