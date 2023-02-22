from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken, OutstandingToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers, exceptions, fields
from django.contrib.auth.models import update_last_login
from users.models import Oficial, People



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = Oficial.USERNAME_FIELD

    def __init__(self, *args, **kwargs):
        super(CustomTokenObtainPairSerializer, self).__init__(*args, **kwargs)
        self.fields['document'].required = False
        self.fields['password'].required = False

    def login_user_registration(self, document, password):
        status = 1
        suspended = 0
        expired = 0
        type_valid = 1
        msg = ""
        user = Oficial.objects.filter(document=document).first()
        rs = {'status': status, 'suspended': suspended, 'user': user,
              'expired': expired, 'type_valid': type_valid, 'msg': msg}
        return rs


    def validate(self, attrs):
        try:
            request = self.context.get("request", None)
            data = request.data
            document = data.get("document", None)
            password = data.get('password', '')
            rs = self.login_user_registration(document, password)
            user = rs.get('user', None)
            msg = rs.get('msg', "Error")
            token = self.get_token(user)
            data = super(CustomTokenObtainPairSerializer,
                             self).validate(attrs)
            data['exp'] = token.payload.get(
                    'exp', None) if token is not None else None
            data['user'] = OficialSerializer(user).data
            return data
        except:
            raise exceptions.AuthenticationFailed(msg)


    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        update_last_login(None, user)
        return token




class OficialSerializer(serializers.ModelSerializer):

    class Meta:
        model = Oficial
        fields = ('id', 'name', 'document', 'created_at', 'updated_at', )


    def update(self, instance, validated_data):
        name = validated_data.pop('name', None)
        document = validated_data.pop('document', None)
        instance.name = name
        instance.document = document
        instance.set_password(str(document))
        instance.save()
        return instance


class OficialManageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Oficial
        fields = ('id', 'name', 'document', 'rol', 'username', 'created_at', 'updated_at',)

    def create(self, validated_data):
        created = Oficial.objects.create(**validated_data)
        if created:
            if validated_data['document']:
                created.set_password(str(validated_data['document']))
                created.save()

        return created
    
    def update(self, instance, validated_data):
        name = validated_data.pop('name', None)
        document = validated_data.pop('document', None)
        instance.name = name
        instance.document = document
        instance.set_password(str(document))
        instance.save()
        return instance



class PeopleSerializer(serializers.ModelSerializer):

    class Meta:
        model = People
        fields = ('id', 'name', 'email', 'created_at', 'updated_at', )


