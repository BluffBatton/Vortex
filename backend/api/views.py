from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets
from .serializers import GlobalFuelPriceSerializer, UserSerializer, EmailTokenObtainPairSerializer, UserWalletSerializer, GasStationSerializer, FuelTransactionSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import CustomUser, UserWallet, GasStation, FuelTransaction, GlobalFuelPrice

from django.urls import re_path as url
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='Pastebin API')

urlpatterns = [
    url(r'^$', schema_view)
]

User = get_user_model()
# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Allow any user to create an account

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UserWalletView(generics.RetrieveAPIView):
    serializer_class = UserWalletSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(UserWallet, user=self.request.user)
    
class GasStationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GasStation.objects.all()
    serializer_class = GasStationSerializer
    permission_classes = [IsAuthenticated]  # или AllowAny для публичного списка

class FuelTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = FuelTransactionSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return FuelTransaction.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GlobalFuelPriceViewSet(viewsets.ModelViewSet):
    queryset = GlobalFuelPrice.objects.all()
    serializer_class = GlobalFuelPriceSerializer
    permission_classes = [IsAdminUser]

# class ModeratorViewSet(viewsets.ModelViewSet):
#     queryset = CustomUser.objects.filter(is_staff=True)
#     serializer_class = ModeratorSerializer
#     permission_classes = [IsAdminUser]

