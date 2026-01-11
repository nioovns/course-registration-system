from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status

class AllChoicesTests(APITestCase):
    def test_get_all_choices(self):
        url = reverse('all-choices') 
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_keys = [
            "unit_choices",
            "day_choices",
            "time_choices",
            "faculty_choices",
            "classroom_choices"
        ]
        for key in expected_keys:
            self.assertIn(key, response.data)

        self.assertIsInstance(response.data['time_choices'], list)
        for item in response.data['time_choices']:
            self.assertIn('label', item)
            self.assertIn('start', item)
            self.assertIn('end', item)
