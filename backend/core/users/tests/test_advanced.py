from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()

class AdvancedAuthTests(APITestCase):
    def setUp(self):
        # ایجاد یک دانشجوی نمونه
        self.student = User.objects.create_user(
            username='student_adv',
            password='password123',
            role=User.Roles.STUDENT,
            student_id='99123456'
        )
        self.login_url = reverse('token_obtain_pair')
        self.logout_url = reverse('auth_logout')
