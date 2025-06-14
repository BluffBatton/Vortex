from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserWallet, GasStation, GlobalFuelPrice, FuelTransaction, UserAchievement, Achievement, PromoCode

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


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'phone_number': {'required': False},
        }

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already been used")
        return value

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_val = attrs.get("username")
        try:
            user = User.objects.get(email__iexact=login_val)
            attrs['username'] = user.get_username()
        except User.DoesNotExist:
            pass
        
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
            is_staff=True,
            is_superuser=False
        )
        return user
    

class UserAchievementSerializer(serializers.ModelSerializer):
    title       = serializers.CharField(source='achievement.title')
    description = serializers.CharField(source='achievement.description')
    icon_name   = serializers.CharField(source='achievement.icon_name')

    class Meta:
        model = UserAchievement
        fields = ['achievement_id', 'title', 'description', 'icon_name', 'unlocked_at']

class PromoCodeSerializer(serializers.ModelSerializer):
    valid = serializers.SerializerMethodField()

    class Meta:
        model = PromoCode
        fields = ['code', 'discount_percent', 'expires_at', 'valid']

    def get_valid(self, obj):
        return obj.is_valid()