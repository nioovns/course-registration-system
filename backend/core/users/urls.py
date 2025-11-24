from django.urls import path
from django.urls import path
from .views import CustomTokenObtainPairView, LogoutView, AdminDashboardView, ProfessorDashboardView, StudentDashboardView

from .views import (
    AdminDashboardView,
    ProfessorDashboardView,
    StudentDashboardView
)

urlpatterns = [
    path('dashboard/admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('dashboard/professor/', ProfessorDashboardView.as_view(), name='professor-dashboard'),
    path('dashboard/student/', StudentDashboardView.as_view(), name='student-dashboard'),
]