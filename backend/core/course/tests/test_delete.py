from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from course.models import Course

class CourseDeleteTests(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(
            name="Test Course",
            code="TEST101",
            capacity=30
        )
        self.url = reverse('course-detail', kwargs={'pk': self.course.id})

    def test_delete_course_success(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(id=self.course.id).exists())

    def test_delete_course_not_found(self):
        url = reverse('course-detail', kwargs={'pk': 999}) 
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
