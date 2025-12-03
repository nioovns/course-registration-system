from rest_framework.test import APITestCase
from django.urls import reverse
from users.models import User
from course.models.ClassSession import ClassSession
from course.models.Course import Course
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import time

class CourseIntegrationTest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="admin1", password="pass123", role=User.Roles.ADMIN)
        self.professor = User.objects.create_user(username="prof1", password="pass123", role=User.Roles.PROFESSOR, professor_code="P001")
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_create_course(self):
        url = reverse('course-list')  
        session_data = [{"day": "sat", "start_time": "08:00", "end_time": "10:00", "faculty": "eng", "room": "101"}]
        data = {
            "name": "Integration Course",
            "code": "CS300",
            "units": 2,
            "capacity": 30,
            "professor": self.professor.username,
            "sessions": session_data
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Course.objects.count(), 1)

    def test_update_course_partial(self):
        course = Course.objects.create(name="Old Name", code="CS301", units=2, capacity=20, professor=self.professor)
        url = reverse('course-detail', kwargs={'pk': course.id})
        response = self.client.patch(url, {"name": "Updated Name"}, format='json')
        self.assertEqual(response.status_code, 200)
        course.refresh_from_db()
        self.assertEqual(course.name, "Updated Name")

    def test_delete_course(self):
        course = Course.objects.create(name="To Delete", code="CS302", units=2, capacity=20, professor=self.professor)
        url = reverse('course-detail', kwargs={'pk': course.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Course.objects.filter(id=course.id).exists())

    def test_update_course_full_put(self):
        course = Course.objects.create(
            name="Old Name",
            code="CS301",
            units=2,
            capacity=20,
            professor=self.professor
        )

        url = reverse('course-detail', kwargs={'pk': course.id})
        payload = {
            "name": "New Course Name",
            "code": "CS302",
            "units": 3,
            "capacity": 30,
            "professor": self.professor.username,
            "sessions": [
                {
                    "day": "sat",
                    "start_time": "08:00",
                    "end_time": "10:00",
                    "faculty": "eng",
                    "room": "101"
                },
                {
                    "day": "sun",
                    "start_time": "10:00",
                    "end_time": "12:00",
                    "faculty": "eng",
                    "room": "102"
                }
            ],
            "prerequisites": []
        }

        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, 200)

        course.refresh_from_db()
        self.assertEqual(course.name, "New Course Name")
        self.assertEqual(course.code, "CS302")
        self.assertEqual(course.units, 3)
        self.assertEqual(course.capacity, 30)
        self.assertEqual(course.professor, self.professor)
        self.assertEqual(course.sessions.count(), 2)
