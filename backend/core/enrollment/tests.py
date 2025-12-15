from django.test import TestCase
from rest_framework.test import APITestCase
from .serializer import EnrollmentSettingsSerializer

class EnrollmentSettingsSerializerTest(APITestCase):

    def test_serializer_valid_data(self):
        data = {
            "min_units": 12,
            "max_units": 20,
            "is_active": True
        }
        serializer = EnrollmentSettingsSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_serializer_invalid_units(self):
        data = {
            "min_units": 20,
            "max_units": 12,
            "is_active": True
        }
        serializer = EnrollmentSettingsSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)