from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User, Student
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from enrollment.models.Enrollment import Enrollment
from enrollment.models.EnrollmentSettings import EnrollmentSettings
from datetime import time


class EnrollmentIntegrationTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='std_cycle', password='password', role=User.Roles.STUDENT)
        self.student = Student.objects.create(user=self.user, student_id="992020", first_name="Test", last_name="User")

        self.client.force_authenticate(user=self.user)
        self.list_url = reverse('enrollment-list')

        self.settings = EnrollmentSettings.objects.create(is_active=True, max_units=20, min_units=10)

        self.session_a = ClassSession.objects.create(day='sat', start_time=time(8, 0), end_time=time(10, 0), room="101")
        self.course_a = Course.objects.create(name="Course A", code="1001", units=3, capacity=10)
        self.course_a.sessions.add(self.session_a)

        self.session_b = ClassSession.objects.create(day='sun', start_time=time(8, 0), end_time=time(10, 0), room="102")
        self.course_b = Course.objects.create(name="Course B", code="1002", units=3, capacity=10)
        self.course_b.sessions.add(self.session_b)

    def test_enroll_multiple_and_withdraw_one(self):
        initial_cap_a = self.course_a.capacity
        initial_cap_b = self.course_b.capacity

        self.client.post(self.list_url, {'course': self.course_a.code})
        self.client.post(self.list_url, {'course': self.course_b.code})

        self.course_a.refresh_from_db()
        self.course_b.refresh_from_db()

        self.assertEqual(self.course_a.capacity, initial_cap_a - 1)
        self.assertEqual(self.course_b.capacity, initial_cap_b - 1)
        self.assertEqual(Enrollment.objects.filter(student=self.student).count(), 2)

        delete_url = f"{self.list_url}{self.course_a.code}/"
        response = self.client.delete(delete_url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.course_a.refresh_from_db()
        self.course_b.refresh_from_db()

        self.assertEqual(self.course_a.capacity, initial_cap_a)
        self.assertEqual(self.course_b.capacity, initial_cap_b - 1)

        self.assertFalse(Enrollment.objects.filter(student=self.student, course=self.course_a).exists())
        self.assertTrue(Enrollment.objects.filter(student=self.student, course=self.course_b).exists())

    def test_unauthorized_access(self):
        self.client.logout()
        data = {'course': self.course_a.code}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_professor_cannot_enroll(self):
        prof_user = User.objects.create_user(username='prof1', password='password', role=User.Roles.PROFESSOR)
        self.client.force_authenticate(user=prof_user)

        data = {'course': self.course_a.code}
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_other_student_enrollment(self):
        other_user = User.objects.create_user(username='std2', password='password', role=User.Roles.STUDENT)
        other_student = Student.objects.create(user=other_user, student_id="999999", first_name="Other",
                                               last_name="Student")
        Enrollment.objects.create(student=other_student, course=self.course_a)

        delete_url = f"{self.list_url}{self.course_a.code}/"
        response = self.client.delete(delete_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Enrollment.objects.filter(student=other_student, course=self.course_a).exists())