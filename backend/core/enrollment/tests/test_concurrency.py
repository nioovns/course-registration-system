import threading
from django.test import TransactionTestCase
from django.urls import reverse
from users.models import User, Student
from course.models.Course import Course
from enrollment.models.Enrollment import Enrollment


class EnrollmentConcurrencyTests(TransactionTestCase):

    def setUp(self):
        self.course = Course.objects.create(name="Pop Course", code="999", units=3, capacity=1)
        self.url = reverse('enrollment-list')
        self.students = []
        self.users = []

        for i in range(5):
            user = User.objects.create_user(username=f'std_{i}', password='password', role=User.Roles.STUDENT)
            student = Student.objects.create(user=user, student_id=f"99{i}", first_name=f"S{i}", last_name="T")
            self.users.append(user)
            self.students.append(student)

    def test_race_condition_on_last_seat(self):
        def enroll_request(user):
            from rest_framework.test import APIClient
            client = APIClient()
            client.force_authenticate(user=user)
            client.post(self.url, {'course': '999'})

        threads = []
        for user in self.users:
            t = threading.Thread(target=enroll_request, args=(user,))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        self.course.refresh_from_db()
        success_count = Enrollment.objects.filter(course=self.course).count()

        self.assertEqual(self.course.capacity, 0)
        self.assertEqual(success_count, 1)