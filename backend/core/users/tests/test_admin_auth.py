from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class AdminLoginTests(APITestCase):
    def setUp(self):
        self.login_url = reverse('token_obtain_pair')
        self.admin_username = 'admin_user'
        self.admin_password = 'secure_password_123'
        self.admin_user = User.objects.create_user(
            username=self.admin_username,
            password=self.admin_password,
            role=User.Roles.ADMIN,
            email='admin@university.com'
        )
