'''from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from users.models import User

#test-read
#ok
class CourseViewSetTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # ساخت یوزر ادمین


        self.user = User.objects.create_user(
            username='tester',
            password='password123',
            role=User.Roles.ADMIN,
            email='tester@example.com'
        )

        self.client.force_authenticate(user=self.user)

        # ساخت سشن کلاس
        self.session1 = ClassSession.objects.create(
            day='sat',
            start_time='14:00',
            end_time='16:00',
            room='301',
            faculty='eng'
        )

        # --- اصلاح شده: حذف units=3 ---
        self.course1 = Course.objects.create(
            name="Math",
            code="M101",
            capacity=30
            # units=3  <--- این خط را پاک کنید چون مدل شما این فیلد را ندارد
        )
        self.course1.sessions.add(self.session1)

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
'''

# test for retrieve def ---> in views
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from users.models import User
from course.models.Course import Course

'''
class CourseRetrieveTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # 1. ساخت یوزر ادمین (چون ویوی شما IsAdmin دارد)
        self.admin_user = User.objects.create_user(
            username='admin_tester',
            password='password123',
            role=User.Roles.ADMIN,
            email='admin@test.com'
        )

        # 2. لاگین کردن
        self.client.force_authenticate(user=self.admin_user)

        # 3. ساخت یک درس واقعی برای تست کردن سناریوی موفق
        self.course = Course.objects.create(
            name="Data Structures",
            code="CS202",
            capacity=40
        )

        # ساخت URL برای همین درس ساخته شده
        # اگر basename='course' باشد، نام url می‌شود: course-detail
        self.valid_url = reverse('course-detail', kwargs={'pk': self.course.pk})

    # --- تست اول: وقتی درس وجود دارد ---
    def test_retrieve_existing_course(self):
        """
        باید کد 200 برگرداند و نام درس داخل پاسخ باشد.
        """
        response = self.client.get(self.valid_url)

        # 1. چک کردن استاتوس کد
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 2. چک کردن اینکه دیتای درست برگشته (مثلا اسمش درسته؟)
        self.assertEqual(response.data['name'], "Data Structures")
        self.assertEqual(response.data['code'], "CS202")

    # --- تست دوم: وقتی درس وجود ندارد ---
    def test_retrieve_non_existent_course_returns_404(self):
        """
        باید کد 404 برگرداند (تست گارد امنیتی get_object_or_404).
        """
        # یک آیدی الکی که می‌دانیم نیست (مثلا 9999)
        invalid_url = reverse('course-detail', kwargs={'pk': 9999})

        response = self.client.get(invalid_url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
'''
'''
##########################################################################################
#test for course/serializers/CourseSerializer.py
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from users.models import User
from course.models import Course, ClassSession


class CourseFunctionalityTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username='admin_tester',
            password='123',
            role=User.Roles.ADMIN,
            email='admin@test.com'
        )
        self.client.force_authenticate(user=self.user)

        self.session1 = ClassSession.objects.create(day="sat", start_time="08:00", end_time="10:00", room="101")
        self.session2 = ClassSession.objects.create(day="sun", start_time="10:00", end_time="12:00", room="102")

    def test_can_create_course_automatically(self):

        data = {
            "name": "New Auto Course",
            "code": "AUTO_101",
            "capacity": 20,
            "units": 3,
            # ما فقط آیدی می‌فرستیم، DRF باید خودش وصلش کند
            "sessions": [self.session1.id, self.session2.id]
        }


        url = reverse('course-list')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        course = Course.objects.get(code="AUTO_101")
        self.assertEqual(course.name, "New Auto Course")

        self.assertEqual(course.sessions.count(), 2)
        print("\n✅ CREATE Test Passed: Course created and sessions linked automatically.")

    def test_can_update_course_automatically(self):

        course = Course.objects.create(name="Old Name", code="OLD_1", capacity=10)
        course.sessions.add(self.session1)

        data = {
            "name": "Updated Name",
            "sessions": [self.session1.id, self.session2.id]
        }

        url = reverse('course-detail', kwargs={'pk': course.pk})
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        course.refresh_from_db()
        self.assertEqual(course.name, "Updated Name")

        self.assertEqual(course.sessions.count(), 2)
        print("\n✅ UPDATE Test Passed: Course updated and M2M relations handled automatically.")
        '''
#########################################################################################################

from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from course.models import Course, ClassSession
from users.models import User
from datetime import time


class CourseUpdateTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # 1. ساخت یوزر ادمین و لاگین
        self.user = User.objects.create_user(
            username='admin_updater',
            password='password123',
            role=User.Roles.ADMIN,
            email='admin@test.com'
        )
        self.client.force_authenticate(user=self.user)

        self.session1 = ClassSession.objects.create(day="mon", start_time=time(9, 0), end_time=time(10, 0), room="A101")
        self.session2 = ClassSession.objects.create(day="tue", start_time=time(11, 0), end_time=time(12, 0),
                                                    room="B202")

        self.course = Course.objects.create(name="Test Course", code="COURSE188", capacity=30)
        self.course.sessions.set([self.session1, self.session2])
        self.url = reverse('course-detail', kwargs={'pk': self.course.id})

    def test_successful_update(self):
        data = {
            "name": "Updated Course",
            "code": "COURSE_NEW",
            "capacity": 35,
            # ارسال آیدی‌ها (چون سریالایزر اصلاح شد)
            "sessions": [self.session1.id, self.session2.id]
        }

        # استفاده از patch برای آپدیت تمیز
        response = self.client.patch(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.course.refresh_from_db()
        self.assertEqual(self.course.name, "Updated Course")
        self.assertEqual(self.course.sessions.count(), 2)

    def test_capacity_validation(self):
        data = {"capacity": -5}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)