from rest_framework.test import APITestCase
from course.serializers.CourseSerializer import CourseSerializer
from course.models import Course, ClassSession

class TestCourseSerializer(APITestCase):

    def test_course_with_sessions(self):
        data = {
            "name": "Math",
            "code": "M101",
            "capacity": 30,
            "sessions": [
                {"day": "mon", "start_time": "09:00", "end_time": "10:30", "room": "101"},
                {"day": "wed", "start_time": "11:00", "end_time": "12:30", "room": "102"}
            ],
            "prerequisites": []
        }

        serializer = CourseSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors) 

        course = serializer.save() 

        self.assertEqual(course.name, "Math")
        self.assertEqual(course.capacity, 30)

        self.assertEqual(course.sessions.count(), 2)
        first_session = course.sessions.first()
        self.assertEqual(first_session.room, "101")
        self.assertEqual(first_session.start_time.strftime("%H:%M"), "09:00")
