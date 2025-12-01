from django.test import TestCase
from rest_framework.exceptions import ValidationError
from course.services.AdminServices import AdminService
from course.models.Course import Course
from course.models.ClassSession import ClassSession


class AdminCreate(TestCase):
    def setUp(self):
        self.service = AdminService()
        self.session1 = ClassSession.objects.create(day="mon", start_time="09:00", end_time="10:30", room="A101")
        self.session2 = ClassSession.objects.create(day="tue", start_time="11:00", end_time="12:30", room="B202")

    def test_create_course_service(self):
        prereq1 = Course.objects.create(name="Intro to CS", code="CS100", capacity=30)
        prereq2 = Course.objects.create(name="Intro to CSS", code="CS101", capacity=50)

        data = {
            "name": "Advanced CS",
            "code": "CS200",
            "capacity": 25,
            "sessions": [self.session1.id, self.session2.id],
            "prerequisites": [prereq1.id, prereq2.id],
        }

        course = self.service.create_course(data)

        self.assertEqual(course.name, "Advanced CS")
        self.assertEqual(course.capacity, 25)
        self.assertEqual(course.sessions.count(), 2)
        self.assertIn(prereq1, course.prerequisites.all())

    def test_get_existent_code_returns_validation_error(self):
        prereq1 = Course.objects.create(name="Intro to CS", code="CS100", capacity=30)

        data1 = {
            "name": "Advanced CS",
            "code": "CS200",
            "capacity": 25,
            # ارسال آیدی
            "sessions": [self.session1.id, self.session2.id],
            "prerequisites": [prereq1.id],
        }

        course1 = self.service.create_course(data1)
        self.assertEqual(course1.name, "Advanced CS")

        data2 = {
            "name": "Math",
            "code": "CS200",  # کد تکراری
            "capacity": 30,
            "sessions": [self.session1.id],
            "prerequisites": [],
        }

        with self.assertRaises(ValidationError) as context:
            self.service.create_course(data2)

        self.assertIn("unique", str(context.exception))

    def test_create_course_negative_capacity_raises_validation_error(self):
        data = {
            "name": "Physics",
            "code": "PH101",
            "capacity": -5,
            # ارسال آیدی
            "sessions": [self.session1.id],
            "prerequisites": []
        }

        with self.assertRaises(ValidationError) as context:
            self.service.create_course(data)

        self.assertTrue(
            "greater than" in str(context.exception) or "Capacity must be greater than 0" in str(context.exception))