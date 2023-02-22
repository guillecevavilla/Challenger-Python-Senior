from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from model_bakery import baker
from users.models import People, Oficial
from rest_framework import status


class UsersTest(APITestCase):

    def test_add_people(self):
        data = {"name": "Guillermo",
                "email": "guillecevavilla@gmail.com"}
        url = reverse('users:people-list')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_delete_people(self):
        user = baker.make(People, name="Guillermo", email="guillecevavilla@gmail.com")        
        url = reverse('users:people-list')
        url = url + str(user.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    
    def test_modify_people(self):
        user = baker.make(People, name="Guillermo", email="guillecevavilla@gmail.com")        
        url = reverse('users:people-list')
        url = url + str(user.id) + '/'
        data = {"name": "Guillermo Cevallos"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

