from django_filters import rest_framework as filters
from users.models import Oficial, People
from django.db.models import Q



class OficialFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    rol = filters.CharFilter(method='filter_rol')

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(document__icontains=value)
        )

    def filter_rol(self, queryset, name, value):
        return queryset.filter(rol = value)

    class Meta:
        model = Oficial
        fields = ['id', 'name', 'document', 'rol', 'search']



class PeopleFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(email__icontains=value)
        )

    class Meta:
        model = People
        fields = ['id', 'name', 'email', 'search']