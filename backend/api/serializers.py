from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [ 'id', 'phone_number', 'email',
                   'first_name', 'last_name', 'password',
                   'is_staff', 'is_superuser' ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'read_only': True},
            'is_superuser': {'read_only': True},
        }

    def create(self, validated_data):
        validated_data.pop('is_staff', None)
        validated_data.pop('is_superuser', None)
        return get_user_model().objects.create_user(**validated_data)


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # attrs["username"] изначально содержит то, что client прислал в "username"
        login_val = attrs.get("username")
        
        # Если пользователь передал email — находим его username по email
        try:
            user = User.objects.get(email__iexact=login_val)
            attrs['username'] = user.get_username()
        except User.DoesNotExist:
            # Можно решить, что дальше передаём оригинальный login_val,
            # и тогда authenticate упадёт, как обычно, если нет username
            pass
        
        # Делаем дальше всё, как в родительском
        data = super().validate(attrs)
        return data