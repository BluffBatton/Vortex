from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserWallet, GasStation, GlobalFuelPrice, FuelTransaction

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = [ 'id', 'phone_number', 'email', 'first_name', 'last_name', 'password',
                   'is_staff', 'is_superuser' ]
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'read_only': True},
            'is_superuser': {'read_only': True},
        }

    def create(self, validated_data):
        validated_data.pop('is_staff', None)
        validated_data.pop('is_superuser', None)
        user = User.objects.create_user(**validated_data)
        UserWallet.objects.create(user=user, amount92=0, amount95=0, amount100=0, amountGas=0, amountDiesel=0)
        return user


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
    
class UserWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserWallet
        fields = ['user', 'amount92', 'amount95', 'amount100', 'amountGas', 'amountDiesel']
        


class GasStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GasStation
        fields = ['id', 'name', 'address', 'latitude', 'longitude', 'moderator', 'price92', 'price95', 'price100', 'priceGas', 'priceDiesel']
        read_only_fields = ['id']
        extra_kwargs = {
            'name': {'required': True},
            'address': {'required': True},
        }

class GlobalFuelPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalFuelPrice
        fields = ['id', 'name', 'price']
        read_only_fields = ['id']

class FuelTransactionSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = FuelTransaction
        fields = ['id', 'fuel_type', 'amount', 'price', 'transaction_type', 'user', 'date']
        read_only_fields = ['id', 'date']

    def validate_fuel_type(self, value):
        allowed_types = ['92', '95', '100', 'Gas', 'Diesel']
        if value not in allowed_types:
            raise serializers.ValidationError("Недопустимый тип топлива.")
        return value

    def validate_transaction_type(self, value):
        allowed_types = ['buy', 'sell']
        if value not in allowed_types:
            raise serializers.ValidationError("Недопустимый тип транзакции.")
        return value



class ModeratorCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name',''),
            last_name=validated_data.get('last_name',''),
            is_staff=True,        # вот здесь
            is_superuser=False
        )
        return user
    
