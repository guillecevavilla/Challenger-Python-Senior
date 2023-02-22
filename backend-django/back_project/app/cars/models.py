from django.db import models
from simple_history.models import HistoricalRecords



class Vehicle(models.Model):
    placa = models.CharField(max_length=250, unique=True)
    color = models.CharField(max_length=7, blank=True, null=True)
    branch = models.CharField(max_length=250, blank=True, null=True)
    people = models.ForeignKey('users.People', related_name='vehicle_people', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.placa}'



class Infraction(models.Model):
    placa_patente = models.CharField(max_length=250, unique=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    comentarios = models.CharField(max_length=250, blank=True, null=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.placa_patente}'



