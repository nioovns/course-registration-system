from rest_framework.test import APITestCase
from course.serializers.CourseSerializer import CourseSerializer
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from datetime import time


class TestCourseSerializer(APITestCase):

    def test_course_with_sessions(self):
        session1 = ClassSession.objects.create(
            day="mon",
            start_time=time(9, 0),
            end_time=time(10, 30),
            room="101"
        )
        session2 = ClassSession.objects.create(
            day="wed",
            start_time=time(11, 0),
            end_time=time(12, 30),
            room="102"
        )
        data = {
            "name": "Math",
            "code": "M101",
            "capacity": 30,
            "sessions": [session1.id, session2.id],
            "prerequisites": []
        }

        serializer = CourseSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        course = serializer.save()

        self.assertEqual(course.name, "Math")
        self.assertEqual(course.capacity, 30)

        self.assertEqual(course.sessions.count(), 2)
        first_session = course.sessions.first()
        self.assertTrue(course.sessions.filter(room="101").exists())