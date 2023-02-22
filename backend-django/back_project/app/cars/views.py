from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework import status
from django_filters import rest_framework as filters
from commons.pagination import StandardPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from commons.pagination import StandardPagination
from cars.models import Vehicle, Infraction
from users.models import People
from cars.serializers import VehicleSerializer, VehicleManageSerializer, InfractionSerializer, InfractionManageSerializer
from cars.filters import CarsFilter, InfractionFilter




class VehicleViewSet(ModelViewSet):
    parser_classes = (JSONParser,)
    pagination_class = StandardPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = CarsFilter
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return Vehicle.objects.order_by('-id')

    def get_serializer_class(self):
        if self.action in ['create']:
            return VehicleManageSerializer
        else:
            return VehicleSerializer
        
    
    @action(methods=['get'], detail=False, url_path="generar_informe", url_name="generar_informe")
    def generar_informe(self, request):
        email = request.query_params.get('email', None)
        content = {
            "message": "not found",
            "error": True
        }
        if email is None:
            return Response(content, status=status.HTTP_404_NOT_FOUND)
            
        try:
            people = People.objects.get(email = email)
            vehicles = Vehicle.objects.filter(people =people )
            if vehicles:
                placas = []
                for item in vehicles.iterator():
                    placas.append(item.placa)
                infractions = Infraction.objects.filter(placa_patente__in = placas)
                infractions = self.paginate_queryset(infractions)
                serializer = InfractionSerializer(infractions, many= True)
            return self.get_paginated_response(serializer.data)
        except People.DoesNotExist:
            content = {
                    "message": "not found",
                    "error": True
            }
            return Response(content, status=status.HTTP_404_NOT_FOUND)

       
        

class InfractionViewSet(ModelViewSet):
    parser_classes = (JSONParser,)
    pagination_class = StandardPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InfractionFilter
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Infraction.objects.order_by('-id')

    def get_serializer_class(self):
        if self.action in ['create']:
            return InfractionManageSerializer
        else:
            return InfractionSerializer