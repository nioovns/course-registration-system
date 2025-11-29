from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from users.models import User
from rest_framework.test import APITestCase, APIClient

class CourseViewSetTest(APITestCase):
    
    
    def setUp(self):

        self.client = APIClient()

        # create user admin
        self.user = User.objects.create_user(
            username='tester',
            password='password123',
            role=User.Roles.ADMIN,  # نقش ادمین می‌دیم F
            email='tester@example.com'
        )
        self.client.force_authenticate(user=self.user)

        self.session1 = ClassSession.objects.create(
            day='sat',
            start_time='14:00',
            end_time='16:00',
            room='301'
        )
        
        self.course1 = Course.objects.create(
            name="Math",
            code="M101",
            capacity=30
        )
        self.course1.sessions.add(self.session1)
        #f
        #self.client = APIClient()

    def test_list_courses(self):
        response = self.client.get("/api/admin/courses/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Math")

    def test_retrieve_course(self):
        response = self.client.get(f"/api/admin/courses/{self.course1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["code"], "M101")

    def test_get_nonexistent_course_returns_404(self):
        url = reverse('course-detail', args=[999])  
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)