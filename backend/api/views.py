from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.views import View
from rest_framework import generics, viewsets, serializers
from backend.settings import LIQPAY_PRIVATE_KEY, LIQPAY_PUBLIC_KEY
from .serializers import GlobalFuelPriceSerializer, UserSerializer, EmailTokenObtainPairSerializer, UserWalletSerializer
from .serializers import GasStationSerializer, FuelTransactionSerializer, ModeratorCreateSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import CustomUser, UserWallet, GasStation, FuelTransaction, GlobalFuelPrice
from django.urls import re_path as url
from rest_framework_swagger.views import get_swagger_view

from django.views.generic import TemplateView
from django.shortcuts import render
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import uuid

from django.views import View
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from liqpay import LiqPay
import uuid

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

        # Проверка на допустимый тип топлива
        if fuel_type not in fuel_field_map:
            raise serializers.ValidationError({'fuel_type': 'Недопустимый тип топлива.'})

        # Обновление соответствующего поля в кошельке
        field_name = fuel_field_map[fuel_type]
        current_amount = getattr(wallet, field_name, 0)
        setattr(wallet, field_name, current_amount + amount)
        wallet.save()

class GlobalFuelPriceViewSet(viewsets.ModelViewSet):
    queryset = GlobalFuelPrice.objects.all()
    serializer_class = GlobalFuelPriceSerializer
    permission_classes = [AllowAny]

class ModeratorViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_staff=True, is_superuser=False)
    serializer_class = ModeratorCreateSerializer
    permission_classes = [IsAdminUser]




class LiqPayPayView(View):
    """
    Отдаёт HTML-страницу с формой LiqPay, которая сразу отправляется на checkout.
    """

    template_name = 'liqpay_payment.html'

    def get(self, request, *args, **kwargs):
        # 1) Получаем параметры из query-string
        amount = request.GET.get('amount')
        fuel_type = request.GET.get('fuel_type', 'fuel')
        order_id = str(uuid.uuid4())

        # 2) Создаём экземпляр LiqPay с ключами из settings
        liqpay = LiqPay(
            settings.LIQPAY_PUBLIC_KEY,
            settings.LIQPAY_PRIVATE_KEY
        )

        # 3) Формируем словарь параметров для LiqPay
        params = {
            'action': 'pay',
            'amount': amount,
            'currency': 'UAH',
            'description': f'Покупка {fuel_type}',
            'order_id': order_id,
            'version': '3',
            'sandbox': 1,  # 1 — тестовый режим
            'server_url': request.build_absolute_uri('/api/liqpay/callback/'),
            'result_url': request.build_absolute_uri('/api/liqpay/result/'),
        }

        # 4) Генерируем data и signature
        data = liqpay.cnb_data(params)
        signature = liqpay.cnb_signature(params)

        # 5) Рендерим шаблон с form
        return render(request, self.template_name, {
            'data': data,
            'signature': signature,
        })

@method_decorator(csrf_exempt, name='dispatch') # type: ignore
class LiqPayCallbackView(View):
    """
    Принимает POST от LiqPay server_url
    URL: /api/liqpay/callback/
    """
    def post(self, request, *args, **kwargs):
        liqpay = liqpay(LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY)
        data = request.POST.get('data')
        signature = request.POST.get('signature')

        # Проверяем подпись
        valid = liqpay.check_signature(data, signature)
        if not valid:
            return HttpResponse(status=400)

        # Декодируем данные платежа
        payload = liqpay.decode_data_from_str(data)
        # TODO: здесь сохраните информацию о платеже, подготовьте транзакцию и т.п.
        print("LiqPay callback payload:", payload)

        return HttpResponse('OK')

class LiqPayResultView(View):
    """
    Опциональный экран-результат для result_url, если вы хотите показывать 
    пользователю простую HTML-страницу об успехе/неудаче.
    """
    template_name = 'liqpay_result.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)