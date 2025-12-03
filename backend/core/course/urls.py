from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet
from .services.AllChoices import AllChoices   

router = DefaultRouter()
router.register(r'', CourseViewSet, basename='course')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/choices/', AllChoices.as_view(), name='all-choices'),
]