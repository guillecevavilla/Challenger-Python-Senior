from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.tokens import RefreshToken
from simple_history.models import HistoricalRecords
from djchoices import ChoiceItem, DjangoChoices



class ROL_OFICIAL(DjangoChoices):
    Root = ChoiceItem(0, 'Root')
    Oficial = ChoiceItem(1, 'Oficial')



class CustomUserManager(BaseUserManager):
    """To use email instead of username"""

    def create_user(self, document, **extra_fields):
        if not document:
            raise ValueError('document is required')
        user = self.model(document=document, **extra_fields)
        user.set_password(str(document))
        user.save()
        return user

    def create_superuser(self, document, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(document, **extra_fields)


class People(models.Model):
    name = models.CharField(max_length=250, blank=True, null=True)
    email = models.EmailField(_('email address'), unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.name}'



class Oficial(AbstractUser):
    name = models.CharField(max_length=250, blank=True, null=True)
    document = models.IntegerField(unique=True)
    username = models.CharField(max_length=250, unique=True)
    rol = models.PositiveIntegerField(choices=ROL_OFICIAL, null=True, blank=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = 'document'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.document}'

    def generate_token(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }



