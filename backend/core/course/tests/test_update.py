from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from datetime import time
from users.models import User  # ایمپورت مدل یوزر

class CourseUpdateTests(APITestCase):
    def setUp(self):
        #
        self.client = APIClient()

        # 1. ساخت یوزر ادمین و لاگین (حل مشکل 401)
        self.user = User.objects.create_user(
            username='admin_tester',
            password='password123',
            role=User.Roles.ADMIN,
            email='admin@test.com'
        )
        self.client.force_authenticate(user=self.user)
        #
        self.session1 = ClassSession.objects.create(
            day="mon",
            start_time=time(9,0),
            end_time=time(10,0),
            room="A101"
        )
        self.session2 = ClassSession.objects.create(
            day="tue",
            start_time=time(11,0),
            end_time=time(12,0),
            room="B202"
        )

        self.course = Course.objects.create(
            name="Testt Course",
            code="COURSE188",
            capacity=30
        )
        self.course.sessions.set([self.session1, self.session2])
        self.url = reverse('course-detail', kwargs={'pk': self.course.id})

    def test_successful_update(self):
        data = {
            "name": "Updated Course",
            "code": "COURSE17777777777",
            "capacity": 35,
            "sessions": [self.session1.id, self.session2.id] #
        }
        response = self.client.put(self.url, data, format='json')
        if response.status_code == 400: #
            print("\n>>> ERROR DATA:", response.data) #
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.name, "Updated Course")
        self.assertEqual(self.course.capacity, 35)
        self.assertEqual(list(self.course.sessions.all()), [self.session1, self.session2])
    '''
    def test_start_time_after_end_time(self):
        course = Course.objects.create(name="X", code="X1", capacity=20)
        bad_session_data = {
            "start_time": "14:00",
            "end_time": "10:00",
            "day": "wed"
        }

        response = self.client.put(
            reverse("course-detail", args=[course.id]),
            {
                "name": "X",
                "code": "X1",
                "capacity": 20,
                "sessions": [bad_session_data],
                "prerequisites": []
            },
            format="json"
        )

        self.assertEqual(response.status_code, 400)

    def test_time_out_of_range(self):
        course = Course.objects.create(name="X1", code="X11", capacity=20)
        bad_session_data = {
            "start_time": "7:00",
            "end_time": "10:00",
            "day": "wed"
        }

        response = self.client.put(
            reverse("course-detail", args=[course.id]),
            {
                "name": "X",
                "code": "X1",
                "capacity": 20,
                "sessions": [bad_session_data],
                "prerequisites": []
            },
            format="json"
        )

        self.assertEqual(response.status_code, 400)
        '''

    def test_capacity_validation(self):
        data = {
            "name": "Course with Too High Capacity",
            "code": "COURSE1",
            "capacity": -5,
            "sessions": [self.session1.id]
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('capacity', str(response.data))

    def test_unique_code_validation(self):
        Course.objects.create(name="Another Course", code="COURSE2", capacity=20)
        data = {
            "name": "Duplicate Code Course",
            "code": "COURSE2",
            "capacity": 30,
            "sessions": [self.session1.id]
        }
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('code', str(response.data))
