from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User, Student
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from enrollment.models.Enrollment import Enrollment
from datetime import time


class EnrollmentLogicTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='std1', password='password', role=User.Roles.STUDENT)
        self.student = Student.objects.create(user=self.user, student_id="991001", first_name="Ali", last_name="Rezaei")

        self.client.force_authenticate(user=self.user)

        self.session1 = ClassSession.objects.create(
            day='sat', start_time=time(10, 0), end_time=time(12, 0), room="101"
        )

        self.math1 = Course.objects.create(
            name="Math 1", code="101", units=3, capacity=10
        )
        self.math1.sessions.add(self.session1)

        self.url = reverse('student-enrollment-list')

    def test_enrollment_success(self):
        data = {'course_id': self.math1.id}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Enrollment.objects.count(), 1)
        self.assertEqual(Enrollment.objects.get().status, Enrollment.Status.ENROLLED)

    def test_enrollment_capacity_full(self):

        self.math1.capacity = 1
        self.math1.save()


        other_user = User.objects.create_user(username='std2', password='123', role=User.Roles.STUDENT)
        other_student = Student.objects.create(user=other_user, student_id="991002", first_name="B", last_name="B")
        Enrollment.objects.create(student=other_student, course=self.math1)

        data = {'course_id': self.math1.id}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("ظرفیت", str(response.data))

    def test_enrollment_already_taken(self):
        """تست اخذ مجدد درس (تکراری)"""
        Enrollment.objects.create(student=self.student, course=self.math1)

        data = {'course_id': self.math1.id}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prerequisite_fail(self):

        math2 = Course.objects.create(name="Math 2", code="102", units=3, capacity=10)
        math2.prerequisites.add(self.math1)

        data = {'course_id': math2.id}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("پیش‌نیاز", str(response.data[0]))

    def test_prerequisite_success(self):
        math2 = Course.objects.create(name="Math 2", code="102", units=3, capacity=10)
        math2.prerequisites.add(self.math1)

        Enrollment.objects.create(
            student=self.student, course=self.math1, status=Enrollment.Status.PASSED
        )

        data = {'course_id': math2.id}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_time_conflict(self):

        Enrollment.objects.create(student=self.student, course=self.math1)

        session_conflict = ClassSession.objects.create(
            day='sat', start_time=time(11, 0), end_time=time(13, 0), room="102"
        )
        physics = Course.objects.create(name="Physics", code="201", units=3, capacity=10)
        physics.sessions.add(session_conflict)

        data = {'course_id': physics.id}
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("تداخل زمانی", str(response.data))