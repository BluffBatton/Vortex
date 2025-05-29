from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from django.contrib.auth import get_user_model
from .models import UserWallet

User = get_user_model()

@receiver(user_signed_up)
def create_wallet_on_social_signup(request, user, **kwargs):
    UserWallet.objects.get_or_create(
        user=user,
        defaults={
            'amount92': 0,
            'amount95': 0,
            'amount100': 0,
            'amountGas': 0,
            'amountDiesel': 0,
        }
    )
