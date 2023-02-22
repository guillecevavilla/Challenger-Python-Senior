from django.urls import path

from rest_framework import routers
from cars import views


app_name = 'cars'

router = routers.SimpleRouter()
router.register('vehicle', views.VehicleViewSet, basename='vehicle')
router.register('cargar_infraccion', views.InfractionViewSet, basename='cargar_infraccion')
urlpatterns = router.urls

