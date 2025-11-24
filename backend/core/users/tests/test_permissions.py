from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

class RolePermissionTests(APITestCase):
    def setUp(self):
        self.student = User.objects.create_user(username='std', password='123', role=User.Roles.STUDENT)
        self.professor = User.objects.create_user(username='prof', password='123', role=User.Roles.PROFESSOR)
        self.admin = User.objects.create_user(username='adm', password='123', role=User.Roles.ADMIN)

        self.student_url = reverse('student-dashboard')
        self.professor_url = reverse('professor-dashboard')
        self.admin_url = reverse('admin-dashboard')

    def test_student_can_access_student_dashboard(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.student_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)



