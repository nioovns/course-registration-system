from django.test import TestCase
from rest_framework.test import APIClient
from users.models import User
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from datetime import time

class CourseAPIDeleteTests(TestCase):
    def setUp(self):
        self.admin_user = User.objects.create(username="admin", role=User.Roles.ADMIN)
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)

        self.session1 = ClassSession.objects.create(
            day="mon",
            start_time=time(8,0),
            end_time=time(10,0),
            faculty="sci",
            room="501"
        )
        self.course1 = Course.objects.create(
            name="Math 101",
            code="MATH101",
            capacity=30
        )
        self.course1.sessions.add(self.session1)

    def test_delete_course_should_delete_related_sessions(self):
        url = f"/api/courses/{self.course1.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

        self.assertFalse(Course.objects.filter(id=self.course1.id).exists())
        self.assertFalse(ClassSession.objects.filter(id=self.session1.id).exists())