from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from model_bakery import baker
from cars.models import Vehicle, Infraction
from users.models import People, Oficial
from rest_framework import status
from rest_framework.authtoken.models import Token



class VehicleTest(APITestCase):

    def setUp(self):
        self.oficial = Oficial.objects.create_user(
            document=1313210999,
            username="1313210999",
            is_active=True,
            name="Guillermo",
            last_name="Cevallos",
            email="guillermo@gmail.com",
            rol=1
        )

        token, created = Token.objects.get_or_create(user=self.oficial)
        self.token = token.key
        


    def test_add_vehicle(self):
        user = baker.make(People, name="Guillermo", email="guillecevavilla@gmail.com")      
        data = {"placa": "MMM-555",
                "color": "plomo",
                "branch": "audi",
                "people": user.pk}
        url = reverse('cars:vehicle-list')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_delete_vehicle(self):
        user = baker.make(People, name="Guillermo", email="guillecevavilla@gmail.com") 
        vehicle = baker.make(Vehicle, placa="MMM-555", color="plomo", branch="audi", people= user)        
        url = reverse('cars:vehicle-list')
        url = url + str(vehicle.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    
    def test_modify_vehicle(self):
        user = baker.make(People, name="Guillermo", email="guillecevavilla@gmail.com") 
        vehicle = baker.make(Vehicle, placa="MMM-555", color="plomo", branch="audi", people= user)       
        url = reverse('cars:vehicle-list')
        url = url + str(vehicle.id) + '/'
        data = {"color": "negro"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_generar_informe(self):
        user = baker.make(People, name="Guillermo", email="guillecevavilla@gmail.com") 
        baker.make(Vehicle, placa="MMM-555", color="plomo", branch="audi", people= user)
        baker.make(Infraction, placa_patente="MMM-555", timestamp="2023-02-23 12:12", comentarios="por cinturon")
        url = reverse('cars:vehicle-generar_informe') + '?email=guillecevavilla@gmail.com&page=1'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    
    def test_add_infraction(self):
        data = {"placa_patente": "MMM-555",
                "timestamp": "2023-02-23 12:12",
                "comentarios": "por cinturon"}
        url = reverse('cars:cargar_infraccion-list')
        response = self.client.post(url, data, **{'HTTP_AUTHORIZATION': f'Bearer {self.token}'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        