from django.test import TestCase
from rest_framework.exceptions import ValidationError
from course.services.AdminServices import AdminService
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import time
from rest_framework.test import APITestCase
from django.urls import reverse

class AdminCreate(APITestCase): 
    def setUp(self):
        self.service = AdminService()
        self.admin = User.objects.create_user(username="admin1", password="pass123", role=User.Roles.ADMIN)
        self.professor = User.objects.create_user(username="نیکو ورناصری", password="pass123", role=User.Roles.PROFESSOR, professor_code="P001")
        refresh = RefreshToken.for_user(self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        # کلاس‌ها آماده برای ارسال
        self.session_data1 = {"day": "mon", "start_time": "09:00", "end_time": "10:30", "faculty": "eng", "room": "101"}
        self.session_data2 = {"day": "tue", "start_time": "11:00", "end_time": "12:30", "faculty": "sci", "room": "500"}

    def test_create_course_service(self):
        prereq1 = Course.objects.create(name="Intro to CS", code="CS100", capacity=30)
        prereq2 = Course.objects.create(name="Intro to CSS", code="CS101", capacity=50)

        data = {
            "name": "Advanced CS",
            "code": "CS200",
            "units":3,
            "capacity": 25,
            "professor": "نیکو ورناصری",
            "sessions": [{"day": "tue", "start_time": "11:00", "end_time": "12:30", "faculty": "sci", "room": "500"}
                          , {"day": "mon", "start_time": "09:00", "end_time": "10:30", "faculty": "eng", "room": "101"}],
            "prerequisites": [],
        }

        course = self.service.create_course(data)

        self.assertEqual(course.name, "Advanced CS")
        self.assertEqual(course.capacity, 25)
        self.assertEqual(course.sessions.count(), 2)

    def test_get_existent_code_returns_validation_error(self):
        prereq1 = Course.objects.create(name="Intro to CS", code="CS100", capacity=30)

        data1 = {
            "name": "Advanced CS",
            "code": "CS200",
            "units": 3, 
            "capacity": 25,
            "sessions": [{"day": "tue", "start_time": "11:00", "end_time": "12:30", "faculty": "sci", "room": "500"}
                          , {"day": "mon", "start_time": "09:00", "end_time": "10:30", "faculty": "eng", "room": "101"}],
            "prerequisites": [prereq1.id],
        }


        course1 = self.service.create_course(data1)
        self.assertEqual(course1.name, "Advanced CS")
        data2 = {
            "name": "Math",
            "code": "CS200",
            "units": 3,  
            "capacity": 30,
            "sessions": [{"day": "tue", "start_time": "11:00", "end_time": "12:30", "faculty": "sci", "room": "500"}
                        ],
            "prerequisites": [],
        }

        with self.assertRaises(ValidationError) as context:
            self.service.create_course(data2)

        self.assertIn("unique", str(context.exception))

    def test_create_course_negative_capacity_raises_validation_error(self):
        data = {
            "name": "Physics",
            "code": "PH101",
            "units": 3,  
            "capacity": -5,
            "sessions": [{"day": "tue", "start_time": "11:00", "end_time": "12:30", "faculty": "sci", "room": "500"}
                        ],
            "prerequisites": []
        }

        with self.assertRaises(ValidationError) as context:
            self.service.create_course(data)

        self.assertTrue(
            "greater than" in str(context.exception) or "Capacity must be greater than 0" in str(context.exception))