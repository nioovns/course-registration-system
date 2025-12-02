from django.test import TestCase
from course.models.ClassSession import ClassSession
from course.models.Course import Course
from users.models import User
from course.serializers.CourseSerializer import CourseSerializer
from datetime import time
from rest_framework import serializers

class CourseSerializerTests(TestCase):

    def setUp(self):
        self.professor = User.objects.create(username="prof1", role=User.Roles.PROFESSOR, professor_code="P001")
        self.student = User.objects.create(username="student1", role=User.Roles.STUDENT, student_id="S001")
        self.fake_professor = User.objects.create(username="fakeprof", role=User.Roles.STUDENT, student_id="S002")

        self.session_data = {
            "day": "mon",
            "start_time": time(8, 0),
            "end_time": time(10, 0),
            "faculty": "sci",
            "room": "501"
        }

    def test_create_course_with_valid_sessions(self):
        data = {
            "name": "Math 101",
            "code": "MATH101",
            "capacity": 30,
            "professor": self.professor.id,
            "sessions": [self.session_data]
        }
        print("professot id is + ", self.professor.id)
        serializer = CourseSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        course = serializer.save()
        self.assertEqual(course.sessions.count(), 1)

    def test_capacity_validation(self):
        data = {"name": "Math 101", "code": "MATH101", "capacity": -5}
        serializer = CourseSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Ensure this value is greater than or equal to 0.", str(serializer.errors))

    def test_professor_role_validation(self):
        print(self.professor.id)
        print(self.student.id)
        print(self.fake_professor.id)
        print(self.fake_professor.role)
        data = {"name": "Math 101", "code": "MATH101", "capacity": 10, "professor": self.fake_professor.id}
        serializer = CourseSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("The professor must have the role of 'Professor'", str(serializer.errors))

    def test_create_course_with_duplicate_session_should_fail(self):
        ClassSession.objects.create(**self.session_data)
        data = {
            "name": "Physics 101",
            "code": "PHYS101",
            "capacity": 20,
            "sessions": [self.session_data]
        }
        serializer = CourseSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("A session with the same time, day, faculty and room already exists", str(serializer.errors))

    def test_update_course_with_conflicting_session_should_fail(self):
        course1 = Course.objects.create(name="Course1", code="C1", capacity=10)
        session = ClassSession.objects.create(**self.session_data)
        course1.sessions.add(session)

        course2 = Course.objects.create(name="Course2", code="C2", capacity=10)
        data = {"sessions": [self.session_data]}
        serializer = CourseSerializer(course2, data=data, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn("A session with the same time, day, faculty and room already exists", str(serializer.errors))

    def test_update_course_add_new_sessions_successfully(self):
        course = Course.objects.create(name="Course1", code="C1", capacity=10)
        new_session = {
            "day": "sun",
            "start_time": time(10, 0),
            "end_time": time(12, 0),
            "faculty": "sci",
            "room": "502"
        }
        data = {"sessions": [new_session]}
        serializer = CourseSerializer(course, data=data, partial=True)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        course = serializer.save()
        self.assertEqual(course.sessions.count(), 1)
        
    def test_units_more_than_3_requires_two_sessions(self):
        data = {
            "name": "Advanced Math",
            "code": "MATH301",
            "capacity": 30,
            "units": 3,  
            "professor": self.professor.id,
            "sessions": [self.session_data]  
        }
        serializer = CourseSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Courses with 3 or more units must have exactly 2 sessions.", str(serializer.errors))

    def test_units_more_than_3_two_sessions_valid(self):
        session2 = {
            "day": "tue",
            "start_time": time(10, 0),
            "end_time": time(12, 0),
            "faculty": "sci",
            "room": "502"
        }
        data = {
            "name": "Advanced Math",
            "code": "MATH301",
            "capacity": 30,
            "units": 3,
            "professor": self.professor.id,
            "sessions": [self.session_data, session2] 
        }
        serializer = CourseSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_units_less_or_equal_2_requires_one_session(self):
        session2 = {
            "day": "tue",
            "start_time": time(10, 0),
            "end_time": time(12, 0),
            "faculty": "sci",
            "room": "502"
        }
        data = {
            "name": "Intro Math",
            "code": "MATH101",
            "capacity": 30,
            "units": 2,  
            "professor": self.professor.id,
            "sessions": [self.session_data, session2]  
        }
        serializer = CourseSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("Courses with 2 or fewer units must have exactly 1 session", str(serializer.errors))

    def test_units_less_or_equal_2_one_session_valid(self):
        data = {
            "name": "Intro Math",
            "code": "MATH101",
            "capacity": 30,
            "units": 2,
            "professor": self.professor.id,
            "sessions": [self.session_data] 
        }
        serializer = CourseSerializer(data=data)
        self.assertTrue(serializer.is_valid())
