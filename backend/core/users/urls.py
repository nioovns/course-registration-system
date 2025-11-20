from django.urls import path
from . import views

urlpatterns = [
    path('', views.test_users, name='test_users'),
]
