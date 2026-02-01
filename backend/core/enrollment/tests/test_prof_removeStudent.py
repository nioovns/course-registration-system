from django.test import TestCase
from django.core.exceptions import ValidationError
from enrollment.services import professor_remove_student
from enrollment.models import Enrollment
from users.models import User, Professor, Student
from course.models.Course import Course
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

class ProfessorRemoveStudentServiceTest(TestCase):

    def setUp(self):
        self.prof_user1 = User.objects.create_user(username='prof1', password='pass123', role= User.Roles.PROFESSOR)
        self.prof1 = Professor.objects.create(user=self.prof_user1, professor_code= "123")
        self.student_user = User.objects.create_user(username='student1', password='pass123', role= User.Roles.STUDENT)
        self.student = Student.objects.create(user=self.student_user)
        self.course = Course.objects.create(
            name="Math 101",
            code="MATH101",
            capacity=30,
            professor=self.prof_user1
        )
        self.enrollment = Enrollment.objects.create(
            student=self.student,
            course=self.course,
            status=Enrollment.Status.ENROLLED
        )

    def test_professor_can_remove_student(self):
        old_capacity = self.course.capacity

        professor_remove_student(
            professor=self.prof_user1,
            course_id=self.course.id,
            student_id=self.student.id
        )

        self.course.refresh_from_db()
        self.assertEqual(self.course.capacity, old_capacity + 1)
        self.assertFalse(
            Enrollment.objects.filter(id=self.enrollment.id).exists()
        )

    def test_other_professor_cannot_remove_student(self):
        self.prof_user2 = User.objects.create_user(username='prof2', password='pass123', role= User.Roles.PROFESSOR)
        other_professor = Professor.objects.create(user=self.prof_user2, professor_code= "1234")

        with self.assertRaises(ValidationError):
            professor_remove_student(
                professor=self.prof_user2,
                course_id=self.course.id,
                student_id=self.student.id
            )

    def test_remove_student_api(self):
        self.client = APIClient()
        self.client.force_authenticate(user=self.prof_user1)
        url = f"/api/enrollment/courses/{self.course.id}/enrollments/{self.student.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)