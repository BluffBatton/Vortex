import base64
import hashlib
import os
import random
from urllib.parse import urljoin
from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.views import View
from google.auth.transport import requests
from rest_framework import generics, viewsets, serializers, permissions
from backend.settings import LIQPAY_PRIVATE_KEY, LIQPAY_PUBLIC_KEY
from .serializers import GlobalFuelPriceSerializer, UserAchievementSerializer, UserSerializer, EmailTokenObtainPairSerializer, UserUpdateSerializer, UserWalletSerializer
from .serializers import GasStationSerializer, FuelTransactionSerializer, ModeratorCreateSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import CustomUser, UserAchievement, UserWallet, GasStation, FuelTransaction, GlobalFuelPrice
from django.urls import re_path as url
from rest_framework_swagger.views import get_swagger_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.generic import TemplateView
from django.shortcuts import render
from django.http import HttpResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import uuid
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.shortcuts import render
from django.conf import settings
from liqpay import LiqPay
import uuid
from django.db import transaction

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

#from backend.api import serializers

schema_view = get_swagger_view(title='Pastebin API')

urlpatterns = [
    url(r'^$', schema_view)
]

User = get_user_model()
# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserUpdateSerializer
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
    #permission_classes = [IsAdminUser] 
    permission_classes = [AllowAny]

class FuelTransactionViewSet(viewsets.ModelViewSet):
    serializer_class = FuelTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FuelTransaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        transaction = serializer.save(user=self.request.user)
        wallet = self.request.user.userwallet

        fuel_field_map = {
            '92': 'amount92',
            '95': 'amount95',
            '100': 'amount100',
            'Gas': 'amountGas',
            'Diesel': 'amountDiesel',
        }

        fuel_type = transaction.fuel_type
        amount = transaction.amount

        if fuel_type not in fuel_field_map:
            raise serializers.ValidationError({'fuel_type': 'Invalid fuel type.'})
        field_name = fuel_field_map[fuel_type]
        current_amount = getattr(wallet, field_name, 0)
        setattr(wallet, field_name, current_amount + amount)
        wallet.save()

    @action(detail=False, methods=['post'], url_path='spend')
    def spend(self, request):
        user = request.user
        fuel_type = request.data.get('fuel_type')
        liters = request.data.get('amount')
        try:
            liters = float(liters)
        except (TypeError, ValueError):
            return Response({'detail': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        wallet = UserWallet.objects.get(user=user)
        field_name = f'amount{fuel_type}'
        if not hasattr(wallet, field_name):
            return Response({'detail': 'Unsupported fuel type'}, status=status.HTTP_400_BAD_REQUEST)

        current = getattr(wallet, field_name)
        if liters > current:
            return Response({'detail': 'Not enough fuel in wallet'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            setattr(wallet, field_name, current - liters)
            wallet.save()

            tx = FuelTransaction.objects.create(
                user=user,
                fuel_type=fuel_type,
                amount=liters,
                price=0,
                transaction_type='sell'
            )

        serializer = self.get_serializer(tx)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class GlobalFuelPriceViewSet(viewsets.ModelViewSet):
    queryset = GlobalFuelPrice.objects.all()
    serializer_class = GlobalFuelPriceSerializer
    permission_classes = [AllowAny]

class ModeratorViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=True, is_superuser=False)
    serializer_class = ModeratorCreateSerializer
    #permission_classes = [IsAdminUser]
    permission_classes = [AllowAny]

from .models import PendingPayment
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.urls             import reverse
from rest_framework import status
class LiqPayPayView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated]

    def get(self, request):
        total     = request.GET.get('amount')
        liters    = request.GET.get('liters')
        fuel_type = request.GET.get('fuel_type')
        if not liters or not liters or not fuel_type:
            return Response({'detail': 'amount, liters и fuel_type обязательны'}, status=status.HTTP_400_BAD_REQUEST)

        pending = PendingPayment.objects.create(
            user        = request.user,
            order_id    = str(uuid.uuid4()),
            fuel_type   = fuel_type,
            liters      = liters,
            total_price = total,
        )

        public_base = os.environ.get("BACKEND_PUBLIC_URL", "https://eager-dingos-behave.loca.lt/")
        callback_url = f"{public_base}{reverse('liqpay_callback')}"
        result_url   = f"{public_base}{reverse('liqpay_result')}"

        lp = LiqPay(settings.LIQPAY_PUBLIC_KEY, settings.LIQPAY_PRIVATE_KEY)
        params = {
          'action'      : 'pay',
          'amount'      : total,
          'currency'    : 'UAH',
          'description' : f'Покупка {fuel_type}',
          'order_id'    : pending.order_id,
          'version'     : '3',
          'sandbox'     : 1,
          'server_url'  : callback_url,
          'result_url'  : result_url,
        }
        data      = lp.cnb_data(params)
        signature = lp.cnb_signature(params)

        return render(request, 'liqpay_form.html', {
            'data'     : data,
            'signature': signature,
        })


@method_decorator(csrf_exempt, name='dispatch')
class LiqPayCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data      = request.POST.get('data')
        signature = request.POST.get('signature')
        if not data or not signature:
            return Response({'detail': 'Missing data or signature'}, status=400)

        lp = LiqPay(settings.LIQPAY_PUBLIC_KEY, settings.LIQPAY_PRIVATE_KEY)
        s = settings.LIQPAY_PRIVATE_KEY + data + settings.LIQPAY_PRIVATE_KEY
        expected_sig = base64.b64encode(hashlib.sha1(s.encode('utf-8')).digest()).decode('utf-8')
        if expected_sig != signature:
            return Response({'detail': 'Bad signature'}, status=400)

        payload = lp.decode_data_from_str(data)
        order_id  = payload.get('order_id')
        status_pay = payload.get('status')

        pending = get_object_or_404(PendingPayment, order_id=order_id)

        if status_pay in ('success', 'sandbox'):

            tx = FuelTransaction.objects.create(
                user             = pending.user,
                fuel_type        = pending.fuel_type,
                amount           = pending.liters,
                price            = pending.total_price,
                transaction_type = 'buy'
            )

            wallet = pending.user.userwallet
            field_map = {
                '92': 'amount92',
                '95': 'amount95',
                '100': 'amount100',
                'Gas': 'amountGas',
                'Diesel': 'amountDiesel',
            }
            fname = field_map[pending.fuel_type]
            setattr(wallet, fname, getattr(wallet, fname) + pending.liters)
            wallet.save()

            print(f"[LiqPayCallback] Credited {pending.liters}L of {pending.fuel_type} to {pending.user.email}")

        pending.delete()

        return Response({'status': 'ok'})

class LiqPayResultView(View):
    template_name = 'liqpay_result.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)
    


class UserAchievementsView(generics.ListAPIView):
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)