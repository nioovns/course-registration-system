from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class AuthIntegrationTest(APITestCase):
    def setUp(self):
        self.student = User.objects.create_user(username="student1", password="pass123", role=User.Roles.STUDENT, student_id="S001")
        self.professor = User.objects.create_user(username="prof1", password="pass123", role=User.Roles.PROFESSOR, professor_code="P001")
        self.admin = User.objects.create_user(username="admin1", password="pass123", role=User.Roles.ADMIN)

    def test_login_and_me_endpoint(self):
        url = reverse('token_obtain_pair')  
        response = self.client.post(url, {"username": "student1", "password": "pass123"})
        self.assertEqual(response.status_code, 200)
        access = response.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        me_url = reverse('user-profile')  
        me_resp = self.client.get(me_url)
        self.assertEqual(me_resp.status_code, 200)
        self.assertEqual(me_resp.data['username'], 'student1')
