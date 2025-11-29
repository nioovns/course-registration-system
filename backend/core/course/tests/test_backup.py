from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from users.models import User


class CourseViewSetTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # 1. ساخت یوزر ادمین
        self.user = User.objects.create_user(
            username='tester',
            password='password123',
            role=User.Roles.ADMIN,
            email='tester@example.com'
        )

        # 2. لاگین (خط اضافه آخر تابع حذف شد)
        self.client.force_authenticate(user=self.user)

        # 3. ساخت دیتای نمونه
        self.session1 = ClassSession.objects.create(
            day='sat',
            start_time='14:00',
            end_time='16:00',
            room='301',
            faculty='eng'  # اگر فیلد الزامی است اضافه کنید
        )

        self.course1 = Course.objects.create(
            name="Math",
            code="M101",
            capacity=30,
            units=3  # اگر فیلد الزامی است
        )
        self.course1.sessions.add(self.session1)

        # استفاده از reverse برای جلوگیری از غلط املایی در URL
        self.list_url = reverse('course-list')
        self.detail_url = reverse('course-detail', kwargs={'pk': self.course1.pk})

    def test_list_courses(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # چک کردن تعداد (ممکن است دیتاهای دیگری هم در دیتابیس تست باشد)
        self.assertTrue(len(response.data) >= 1)
        self.assertEqual(response.data[0]["name"], "Math")

    def test_retrieve_course(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["code"], "M101")

    def test_get_nonexistent_course_returns_404(self):
        url = reverse('course-detail', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)