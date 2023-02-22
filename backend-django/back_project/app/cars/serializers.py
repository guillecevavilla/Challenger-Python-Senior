from rest_framework import serializers
from rest_framework import serializers, exceptions, fields
from users.serializers import PeopleSerializer
from cars.models import Vehicle, Infraction
from users.models import People



class VehicleSerializer(serializers.ModelSerializer):
    people_data = serializers.SerializerMethodField()
    people_name = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = ('id', 'placa', 'color', 'branch', 'people', 'people_data', 'people_name', 'created_at', 'updated_at', )
    

    def get_people_name(self, instance):
        if instance.people:
            return str(instance.people.name)
        return ''
    
    def get_people_data(self, instance):
        if instance.people:
            return PeopleSerializer(instance.people).data
        return None



class VehicleManageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vehicle
        fields = ('id', 'placa', 'color', 'branch', 'people', 'created_at', 'updated_at',)

    def create(self, validated_data):
        return Vehicle.objects.create(**validated_data)
    

    def update(self, instance, validated_data):
        people = validated_data.pop('people', None)
        if people:
            people = People.objects.get(pk = people)
        instance.branch = validated_data.pop('branch', None)
        instance.color = validated_data.pop('color', None)
        instance.people = people
        instance.placa = validated_data.pop('placa', None)
        instance.save()
        return instance
    


class InfractionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Infraction
        fields = ('id', 'placa_patente', 'timestamp', 'comentarios', )
    



class InfractionManageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Infraction
        fields = ('id', 'placa_patente', 'timestamp', 'comentarios',)

    def create(self, validated_data):
        return Infraction.objects.create(**validated_data)
    

    def update(self, instance, validated_data):
        instance.placa_patente = validated_data.pop('placa_patente', None)
        instance.timestamp = validated_data.pop('timestamp', None)
        instance.comentarios = validated_data.pop('comentarios', None)
        instance.save()
        return instance