from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from users.models import User
from datetime import time
from course.models.Course import Course
from course.models.ClassSession import ClassSession
class CourseUpdateTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username='admin_updater',
            password='password123',
            role=User.Roles.ADMIN,
            email='admin@test.com'
        )
        self.client.force_authenticate(user=self.user)


        self.course = Course.objects.create(name="Test Course", code="COURSE188", capacity=30)
        self.course.sessions.set([self.session1, self.session2])
        self.url = reverse('course-detail', kwargs={'pk': self.course.id})

    def test_successful_update(self):
        data = {
            "name": "Updated Course",
            "code": "COURSE_NEW",
        }

        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.name, "Updated Course")
        self.assertEqual(self.course.sessions.count(), 2)

    def test_capacity_validation(self):
        data = {"capacity": -5}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)