from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [ 'id', 'username', 'phone_number', 'email',
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
