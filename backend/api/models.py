import secrets
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
# Create your models here.
class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
    def make_random_password(self, length=12, allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'):
        return ''.join(secrets.choice(allowed_chars) for i in range(length))
    

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField('email address', unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    


class UserWallet(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    amount92 = models.IntegerField()
    amount95 = models.IntegerField()
    amount100 = models.IntegerField()
    amountGas = models.IntegerField()
    amountDiesel = models.IntegerField()
    def __str__(self):
        return f"{self.user.email} - {self.amount92} - {self.amount95} - {self.amount100} - {self.amountGas} - {self.amountDiesel}"
    


class GasStation(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    moderator = models.OneToOneField(CustomUser, on_delete=models.CASCADE, limit_choices_to={'is_staff': True}, related_name='stations')
    price92 = models.DecimalField(max_digits=10, decimal_places=2)
    price95 = models.DecimalField(max_digits=10, decimal_places=2)
    price100 = models.DecimalField(max_digits=10, decimal_places=2)
    priceGas = models.DecimalField(max_digits=10, decimal_places=2)
    priceDiesel = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.name} - {self.address} - {self.latitude} - {self.price92} - {self.price95} - {self.price100} - {self.priceGas} - {self.priceDiesel}"



class GlobalFuelPrice(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.name} - {self.price}"



class FuelTransaction(models.Model):
    fuel_type = models.CharField(max_length=10)
    date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=10, choices=[('buy', 'Buy'), ('sell', 'Sell')])
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.fuel_type} - {self.date} - {self.amount} - {self.price}"
    
from django.db import models
from django.conf import settings
import uuid

class PendingPayment(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fuel_type   = models.CharField(max_length=10)
    liters = models.DecimalField(max_digits=10, decimal_places = 2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} — {self.fuel_type}×{self.liters} = {self.total_price} (order {self.order_id})"

class Achievement(models.Model):
    code        = models.CharField(max_length=50, unique=True)
    title       = models.CharField(max_length=100)
    description = models.TextField()
    icon_name   = models.CharField(max_length=50, help_text="Example: 'local-gas-station' for MaterialIcons, 'emoji-events etc.'")

    def __str__(self):
        return self.code

class UserAchievement(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')

class PromoCode(models.Model):
    code = models.CharField(max_length=32, unique=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2)
    expires_at = models.DateTimeField(null=True, blank=True)

    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (self.expires_at is None or self.expires_at > now)

    def __str__(self):
        return f"{self.code} — {self.discount_percent}%"