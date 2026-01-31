from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnrollmentViewSet, EnrollmentSettingsViewSet, ProfessorEnrollmentViewSet
router = DefaultRouter()
router.register(r'settings', EnrollmentSettingsViewSet, basename='enrollment-settings')
router.register(r'my-courses', EnrollmentViewSet, basename='enrollment')
urlpatterns = [
    path('', include(router.urls)),
    path(
        'courses/<int:course_id>/enrollments/',
        ProfessorEnrollmentViewSet.as_view({'get': 'list'}),
        name='course-enrollments'
    ),
    path(
        'courses/<int:course_id>/enrollments/<int:student_db_id>/', 
        ProfessorEnrollmentViewSet.as_view({'delete': 'destroy'}), 
        name='enrollment-delete'
    ),

]