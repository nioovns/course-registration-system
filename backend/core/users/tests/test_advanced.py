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

    def test_jwt_payload_contains_custom_claims(self):

        # 1. لاگین
        response = self.client.post(self.login_url, {
            'username': 'student_adv',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 2. استخراج و دیکود کردن توکن
        token_str = response.data['access']
        token = AccessToken(token_str)

        # 3. بررسی اینکه آیا اطلاعات ما داخل توکن هست؟
        self.assertEqual(token['role'], 'student')
        self.assertEqual(token['username'], 'student_adv')
        # student id serialiazers
        self.assertEqual(token['student_id'], '99123456')
