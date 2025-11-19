from django.test import TestCase
from course.models.ClassSession import ClassSession
from datetime import time

class ClassSessionModelTest(TestCase):

    def setUp(self):
        self.session = ClassSession.objects.create(
            day='sat',
            start_time=time(14, 0),
            end_time=time(16, 0),
            room='301'
        )

    def test_session_created(self):
        self.assertEqual(self.session.day, 'sat')
        self.assertEqual(self.session.start_time, time(14, 0))
        self.assertEqual(self.session.end_time, time(16, 0))
        self.assertEqual(self.session.room, '301')

    def test_str_method(self):
        expected = "شنبه 14:00:00-16:00:00 | کلاس 301"
        self.assertEqual(str(self.session), expected)
