from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

# Custom User Model to Add Fullname
class CustomUser(AbstractUser):
    fullname = models.CharField(max_length=100, blank=True, null=True)

    # Fix reverse accessor conflicts by adding related_name
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)

    class Meta:
        db_table = "custom_users"

    def __str__(self):
        return self.username


# Model for Uploaded Images
class UploadedImage(models.Model):
    image = models.ImageField(upload_to="uploaded_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    predicted_disease = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "uploaded_images"

    def __str__(self):
        return f"{self.image} - {self.predicted_disease}"


# Model for Prediction Results
class PredictionResult(models.Model):
    image = models.ImageField(upload_to="predicted_images/")
    class_name = models.CharField(max_length=255)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "prediction_results"

    def __str__(self):
        return f"{self.class_name} ({self.confidence:.2f})"
