from django.urls import path
from .views import AdminDashboardView, ProfessorDashboardView, StudentDashboardView

path('dashboard/admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
path('dashboard/professor/', ProfessorDashboardView.as_view(), name='professor-dashboard'),
