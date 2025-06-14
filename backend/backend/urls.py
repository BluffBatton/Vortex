from django.contrib import admin
from django.urls import path, include
from api.views import (AllFuelTransactionsView, CreateUserView, EmailTokenObtainPairView, FuelStatisticsAPI, GoogleLoginView, UserProfileView, 
                       UserWalletView, GasStationViewSet, FuelTransactionViewSet, ValidatePromoView,
                         GlobalFuelPriceViewSet, ModeratorViewSet,LiqPayPayView, LiqPayCallbackView, 
                         LiqPayResultView, UserAchievementsView, CurrentUserRolesOnlyView, CreateOneTimeSuperuserView)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse

def ping_view(request):
    return JsonResponse({'status': 'ok', 'message': 'pong'})

router = DefaultRouter()

router.register(r'gas-stations', GasStationViewSet, basename='gasstation')
router.register(r'fuel-transactions', FuelTransactionViewSet, basename='fueltransaction')
router.register(r'global-fuel-prices', GlobalFuelPriceViewSet, basename='globalfuelprice')
router.register(r'moderators', ModeratorViewSet, basename='moderator')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    
    path('api/token/', EmailTokenObtainPairView.as_view(), name='get_token'),
    
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/user/profile/', UserProfileView.as_view(), name='user_profile'),

    path('api/user/wallet/', UserWalletView.as_view(), name='user_wallet'),

    path('api/user/roles/', CurrentUserRolesOnlyView.as_view(), name='current_user_roles'),
    
    path('api/', include(router.urls)),
    
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    
    path('api/ping/', ping_view),

    path('create-superuser-once/', CreateOneTimeSuperuserView.as_view(), name='create_one_time_super'),
    
    path('api/achievements', UserAchievementsView.as_view(), name='user_achievements'),
    
    path("accounts/", include("allauth.urls")),
    path('api/auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('api/transactions/all/', AllFuelTransactionsView.as_view(), name='all_transactions'),
    path('api/fuel-statistics/', FuelStatisticsAPI.as_view(), name='fuel-statistics'),
    
    path('api/promo/validate/', ValidatePromoView.as_view(), name='promo_validate'),

    path('api/liqpay/pay/', LiqPayPayView.as_view(), name='liqpay_pay'),
    path('api/liqpay/callback/', LiqPayCallbackView.as_view(), name='liqpay_callback'),
    path('api/liqpay/result/', LiqPayResultView.as_view(), name='liqpay_result'),
]