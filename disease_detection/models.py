from django.contrib.auth.models import AbstractUser, Group, Permission,BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
# from django.contrib.auth.models import AbstractUser, BaseUserManager, Group, Permission

class CustomUserManager(BaseUserManager):
    """Custom user manager to ensure proper user creation."""

    def create_user(self, username, email, fullname, phone_number, district, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required for user creation")
        if not username:
            raise ValueError("Username is required")

        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            fullname=fullname,
            phone_number=phone_number,
            district=district,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, fullname, phone_number, district, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(username, email, fullname, phone_number, district, password, **extra_fields)


class CustomUser(AbstractUser):
    fullname = models.CharField(max_length=100, default="Unknown")
    email = models.EmailField(unique=True)
    district = models.CharField(max_length=100, default="Unknown")
    phone_number = models.CharField(max_length=15, unique=False, default="0000000000")
    image_profile = models.ImageField(upload_to="profile_images/", blank=True, null=True)  # ✅ Correct field name
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "fullname", "phone_number", "district"]

    objects = CustomUserManager()

    class Meta:
        db_table = "custom_users"

    def __str__(self):
        return self.username


class UploadedImage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
    image = models.ImageField(upload_to="uploaded_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    predicted_disease = models.CharField(max_length=255, default="Unknown")

    class Meta:
        db_table = "uploaded_images"
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.user.fullname}'s image: {self.image.name}"


class PredictionResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
    image = models.ImageField(upload_to="predicted_images/")
    class_name = models.CharField(max_length=255)
    confidence = models.FloatField()
    recommendation = models.TextField()  # ✅ Add recommendation field
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "prediction_results"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.fullname}'s prediction: {self.class_name} ({self.confidence:.2f})"