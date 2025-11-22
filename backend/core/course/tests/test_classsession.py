from django.test import TestCase
from django.core.exceptions import ValidationError
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
    
    def test_end_time_after_start_time(self):
        session = ClassSession(
            day='tue',
            start_time=time(11, 0),
            end_time=time(10, 0),
            room='102'
        )
        with self.assertRaises(ValidationError) as cm:
            session.full_clean()
        self.assertIn("end_time must be later than start_time", str(cm.exception))
    
    def test_time_within_allowed_range(self):
        early_session = ClassSession(
            day='wed',
            start_time=time(7, 30),
            end_time=time(9, 0),
            room='103'
        )
        with self.assertRaises(ValidationError) as cm1:
            early_session.full_clean()
        self.assertIn("Class times must be between", str(cm1.exception))

        late_session = ClassSession(
            day='thu',
            start_time=time(19, 0),
            end_time=time(21, 0),
            room='104'
        )
        with self.assertRaises(ValidationError) as cm2:
            late_session.full_clean()
        self.assertIn("Class times must be between", str(cm2.exception))