from django.urls import path

from rest_framework import routers
from users import views
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'users'

router = routers.SimpleRouter()
router.register('oficial', views.OficialViewSet, basename='oficial')
router.register('people', views.PeopleViewSet, basename='people')
urlpatterns = router.urls

urlpatterns += [
    path('oficial-token/', views.CustomAuthToken.as_view(), name='oficial-token'),
    path('refresh-token/', TokenRefreshView.as_view(), name='refresh'),
]
