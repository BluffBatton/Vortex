from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import get_user_model, logout
from rest_framework import generics, viewsets
from .serializers import GlobalFuelPriceSerializer, UserSerializer, EmailTokenObtainPairSerializer, UserWalletSerializer
from .serializers import GasStationSerializer, FuelTransactionSerializer, ModeratorCreateSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import CustomUser, UserWallet, GasStation, FuelTransaction, GlobalFuelPrice

from django.urls import re_path as url
# from rest_framework_swagger.views import get_swagger_view

# schema_view = get_swagger_view(title='Pastebin API')

# urlpatterns = [
#     url(r'^$', schema_view)
# ]

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
    
class GasStationViewSet(viewsets.ModelViewSet):
    queryset = GasStation.objects.all()
    serializer_class = GasStationSerializer
    permission_classes = [IsAdminUser]  # или AllowAny для публичного списка

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

class ModeratorViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=True, is_superuser=False)
    serializer_class = ModeratorCreateSerializer
    permission_classes = [IsAdminUser]

# def home(request):
#     return render(request, 'home.html')

# def logout_view(request):
#     logout(request)
#     return redirect('/')