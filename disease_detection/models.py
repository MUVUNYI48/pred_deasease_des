from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    fullname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)

    class Meta:
        db_table = "custom_users"

    def __str__(self):
        return self.username

class UploadedImage(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="uploaded_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    predicted_disease = models.CharField(max_length=255)

    class Meta:
        db_table = "uploaded_images"
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.user.username}'s image: {self.image.name}"

class PredictionResult(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="predicted_images/")
    class_name = models.CharField(max_length=255)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "prediction_results"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s prediction: {self.class_name} ({self.confidence:.2f})"