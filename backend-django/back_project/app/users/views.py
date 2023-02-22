from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from rest_framework import status
from django_filters import rest_framework as filters
from drf_yasg.utils import swagger_auto_schema
from users.models import Oficial, People
from users.serializers import CustomTokenObtainPairSerializer, OficialSerializer, OficialManageSerializer, PeopleSerializer
from users.filters import OficialFilter, PeopleFilter
from users.schemas import RespLogin, RespRefreshToken
from commons.pagination import StandardPagination
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


class AuthTokenViewSet(TokenObtainPairView):

    def get_serializer_class(self):
        has_refresh = self.request.data.get('refresh', False)
        return CustomTokenObtainPairSerializer if not has_refresh else TokenRefreshSerializer



class CustomRefreshTokenView(TokenRefreshView):
    """Create to fix issue 25 in django-rest-framework-simplejwt"""
    serializer_class = TokenRefreshSerializer

    @swagger_auto_schema(without_auth=True,
                         responses={'200': RespRefreshToken,
                                    '401': '{"detail": "Token is invalid or expired", "code": "token_not_valid"}'})
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    


class OficialViewSet(ModelViewSet):
    parser_classes = (JSONParser,)
    pagination_class = StandardPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = OficialFilter
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return Oficial.objects.order_by('-id')

    def get_serializer_class(self):
        if self.action in ['create']:
            return OficialManageSerializer
        else:
            return OficialSerializer
        


class PeopleViewSet(ModelViewSet):
    parser_classes = (JSONParser,)
    pagination_class = StandardPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = PeopleFilter
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return People.objects.order_by('-id')

    def get_serializer_class(self):
        return PeopleSerializer



class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email
        })