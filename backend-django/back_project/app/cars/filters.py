from django_filters import rest_framework as filters
from cars.models import Vehicle, Infraction
from django.db.models import Q



class CarsFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(people__name__icontains=value) |
            Q(email__email__icontains=value)
        )

    class Meta:
        model = Vehicle
        fields = ['id', 'placa', 'color', 'branch', 'people', 'search']



class InfractionFilter(filters.FilterSet):

    class Meta:
        model = Infraction
        fields = ['id', 'placa_patente']