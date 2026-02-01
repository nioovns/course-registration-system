from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from course.models.Course import Course
from enrollment.models.Enrollment import Enrollment
from users.models import Professor, Student, User
User = get_user_model()

class ProfessorEnrollmentViewSetTests(APITestCase):
    def setUp(self):
        self.prof_user1 = User.objects.create_user(username='prof1', password='pass123', role= User.Roles.PROFESSOR)
        self.prof1 = Professor.objects.create(user=self.prof_user1, professor_code= "123")
        self.prof_user2 = User.objects.create_user(username='prof2', password='pass123', role= User.Roles.PROFESSOR)
        self.prof2 = Professor.objects.create(user=self.prof_user2, professor_code= "1234")
        self.course1 = Course.objects.create(
            name="Math 101",
            code="MATH101",
            capacity=30,
            professor=self.prof_user1
        )
        self.student_user = User.objects.create_user(username='student1', password='pass123', role= User.Roles.STUDENT)
        self.student = Student.objects.create(user=self.student_user, first_name = "ali", last_name = "omidi", student_id = "40173109")
        self.enrollment = Enrollment.objects.create(student=self.student, course=self.course1)

        self.client = APIClient()

    def test_professor_can_view_own_course_enrollments(self):
        self.client.force_authenticate(user=self.prof_user1)
        url = f'/api/courses/{self.course1.id}/enrollments/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.enrollment.id)
        print(response.data)

    def test_other_professor_cannot_view_enrollments(self):
        self.client.force_authenticate(user=self.prof_user2)
        url = f'/api/courses/{self.course1.id}/enrollments/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
