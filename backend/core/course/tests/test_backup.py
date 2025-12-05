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

        self.session1 = ClassSession.objects.create(day="mon", start_time=time(9, 0), end_time=time(10, 0),faculty="eng", room="101")
        self.session2 = ClassSession.objects.create(day="tue", start_time=time(11, 0), end_time=time(12, 0),faculty="sci",
                                                    room="500")

        self.course = Course.objects.create(name="Test Course", code="COURSE188", capacity=30)
        self.course.sessions.set([self.session1, self.session2])
        self.url = reverse('course-detail', kwargs={'pk': self.course.id})

    def test_successful_update(self):
        data = {
            "name": "Updated Course",
            "code": "COURSE_NEW",
            "units": 3,  
            "sessions": [
                {"day": "sat", "start_time": "11:00", "end_time": "12:30", "faculty": "art", "room": "90"},
                {"day": "sun", "start_time": "09:00", "end_time": "10:30", "faculty": "eng", "room": "103"}
            ]
        }

        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.name, "Updated Course")
        self.assertEqual(self.course.code, "COURSE_NEW")
        self.assertEqual(self.course.units, 3)
        self.assertEqual(self.course.sessions.count(), 2)
        self.assertNotIn(self.session1, self.course.sessions.all())
        self.assertNotIn(self.session2, self.course.sessions.all())
        
        sessions = self.course.sessions.order_by('day')
        self.assertEqual(sessions[0].day, "sat")
        self.assertEqual(sessions[0].faculty, "art")
        self.assertEqual(sessions[1].day, "sun")
        self.assertEqual(sessions[1].room, "103")


    def test_capacity_validation(self):
        data = {"capacity": -5}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)