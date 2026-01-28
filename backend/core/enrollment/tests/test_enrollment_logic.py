from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User, Student
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from enrollment.models.Enrollment import Enrollment
from enrollment.models.EnrollmentSettings import EnrollmentSettings
from datetime import time


class EnrollmentLogicTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='std1', password='password', role=User.Roles.STUDENT)
        self.student = Student.objects.create(user=self.user, student_id="991001", first_name="Ali", last_name="Rezaei")

        self.client.force_authenticate(user=self.user)

        self.settings = EnrollmentSettings.objects.create(is_active=True, max_units=20, min_units=12)

        self.session1 = ClassSession.objects.create(
            day='sat', start_time=time(10, 0), end_time=time(12, 0), room="101"
        )

        self.math1 = Course.objects.create(
            name="Math 1", code="101", units=3, capacity=10
        )
        self.math1.sessions.add(self.session1)

        self.list_url = reverse('enrollment-list')

    def test_enrollment_success(self):
        initial_capacity = self.math1.capacity
        data = {'course': self.math1.code}

        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Enrollment.objects.count(), 1)
        self.assertEqual(Enrollment.objects.get().status, Enrollment.Status.ENROLLED)

        self.math1.refresh_from_db()
        self.assertEqual(self.math1.capacity, initial_capacity - 1)

    def test_enrollment_capacity_full(self):
        self.math1.capacity = 0
        self.math1.save()

        data = {'course': self.math1.code}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_enrollment_already_taken(self):
        Enrollment.objects.create(student=self.student, course=self.math1, status='enrolled')

        data = {'course': self.math1.code}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prerequisite_fail(self):
        math2 = Course.objects.create(name="Math 2", code="102", units=3, capacity=10)
        math2.prerequisites.add(self.math1)

        data = {'course': math2.code}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prerequisite_success(self):
        math2 = Course.objects.create(name="Math 2", code="102", units=3, capacity=10)
        math2.prerequisites.add(self.math1)

        Enrollment.objects.create(
            student=self.student, course=self.math1, status=Enrollment.Status.PASSED
        )

        data = {'course': math2.code}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_time_conflict(self):
        Enrollment.objects.create(student=self.student, course=self.math1, status='enrolled')

        session_conflict = ClassSession.objects.create(
            day='sat', start_time=time(11, 0), end_time=time(13, 0), room="102"
        )
        physics = Course.objects.create(name="Physics", code="201", units=3, capacity=10)
        physics.sessions.add(session_conflict)

        data = {'course': physics.code}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_max_units_limit(self):
        self.settings.max_units = 3
        self.settings.save()

        Enrollment.objects.create(student=self.student, course=self.math1, status='enrolled')

        physics = Course.objects.create(name="Physics", code="202", units=3, capacity=10)

        data = {'course': physics.code}
        response = self.client.post(self.list_url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_withdraw_course_success(self):
        initial_capacity = self.math1.capacity
        enrollment = Enrollment.objects.create(student=self.student, course=self.math1, status='enrolled')

        self.math1.capacity -= 1
        self.math1.save()
        capacity_before_delete = self.math1.capacity

        url = f"{self.list_url}{self.math1.code}/"

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Enrollment.objects.filter(id=enrollment.id).exists())

        self.math1.refresh_from_db()
        self.assertEqual(self.math1.capacity, capacity_before_delete + 1)