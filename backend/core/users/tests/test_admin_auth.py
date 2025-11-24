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

        def test_admin_can_login_with_correct_credentials(self):
            data = {'username': self.admin_username, 'password': self.admin_password}
            response = self.client.post(self.login_url, data)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn('access', response.data)
            self.assertIn('refresh', response.data)

        def test_admin_cannot_login_with_wrong_password(self):
            data = {'username': self.admin_username, 'password': 'wrong_password'}
            response = self.client.post(self.login_url, data)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
            self.assertNotIn('access', response.data)

        def test_login_fails_with_non_existent_username(self):
            data = {'username': 'ghost_user', 'password': 'password123'}
            response = self.client.post(self.login_url, data)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

