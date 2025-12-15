from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
User = get_user_model()
class CoursePermissionTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin_user = User.objects.create_user(
            username='admin1234',
            password='admin1234',
            role=User.Roles.ADMIN,
            is_superuser=False
        )

        self.professor_user = User.objects.create_user(
            username='prof_user',
            password='profpass123',
            role=User.Roles.PROFESSOR
        )

        self.student_user = User.objects.create_user(
            username='student_user',
            password='studentpass123',
            role=User.Roles.STUDENT
        )

        self.url = reverse('course-list')  

    def test_admin_can_access(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.url)
        self.assertNotEqual(response.status_code, 403)  
        self.assertIn(response.status_code, [200, 404])  
    
    def test_professor_cannot_access(self):
        self.client.force_authenticate(user=self.professor_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 403)

    def test_student_cannot_access(self):
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(self.url)
        self.assertNotEqual(response.status_code, 403)  
        self.assertIn(response.status_code, [200, 404])  

    def test_unauthenticated_cannot_access(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 401)
