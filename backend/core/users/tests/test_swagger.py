from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class SwaggerTests(APITestCase):

    def test_swagger_ui_loads_successfully(self):

        url = reverse('schema-swagger-ui')  # نامی که در urls.py دادیم
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_redoc_loads_successfully(self):

        url = reverse('schema-redoc')  # نامی که در urls.py دادیم
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
