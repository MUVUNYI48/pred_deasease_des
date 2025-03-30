from django.db import models

# Create your models here.
from django.db import models

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploaded_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    predicted_disease = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.image} - {self.predicted_disease}"

class PredictionResult(models.Model):
    image = models.ImageField(upload_to='predicted_images/')
    class_name = models.CharField(max_length=255)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.class_name} ({self.confidence:.2f})"
