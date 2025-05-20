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
    

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField('email address', unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # теперь email — единственное обязательное поле

    objects = CustomUserManager()  # подключаем наш менеджер

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
    
