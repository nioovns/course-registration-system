from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class SwaggerTests(APITestCase):

    def test_swagger_ui_loads_successfully(self):

        url = reverse('schema-swagger-ui')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_redoc_loads_successfully(self):

        url = reverse('schema-redoc')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_schema_json_loads_successfully(self):

        try:
            url = reverse('schema-json', kwargs={'format': 'json'})
        except Exception:
            url = reverse('schema-json', kwargs={'format': '.json'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
