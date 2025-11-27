from django.test import TestCase
from django.core.exceptions import ValidationError
from course.models.ClassSession import ClassSession
from course.models.Course import Course


class CourseModelTest(TestCase):

    def setUp(self):
        self.session1 = ClassSession.objects.create(
            day='sat',
            start_time='14:00',
            end_time='16:00',
            room='301'
        )

    def test_create_course_success(self):
        course = Course.objects.create(
            name="Math 101",
            code="MATH101",
            capacity=30
        )
        course.sessions.add(self.session1)
        course.full_clean()  
        self.assertEqual(course.name, "Math 101")
        self.assertIn(self.session1, course.sessions.all())

    def test_positive_capacity(self):
        course = Course(name="Physics 101", code="PHYS101", capacity=-5)
        with self.assertRaises(ValidationError):
            course.full_clean()  

    def test_prerequisites_assignment(self):
        course1 = Course.objects.create(name="Math 101", code="MATH101", capacity=30)
        course2 = Course.objects.create(name="Math 102", code="MATH102", capacity=25)
        course2.prerequisites.add(course1)
        course2.full_clean()
        self.assertIn(course1, course2.prerequisites.all())
