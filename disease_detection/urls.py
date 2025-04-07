from django.urls import path
from .views import register, login, upload_image, list_predictions, delete_prediction, dashboard
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='api-register'),
    path('login/', login, name='api-login'),
    path('upload/', upload_image, name='api-upload'),
    path('predictions/', list_predictions, name='api-predictions'),
    path('predictions/<int:pk>/delete/', delete_prediction, name='api-delete-prediction'),
    path('dashboard/', dashboard, name='api-dashboard'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),  # JWT refresh token
]


# filepath: /home/muvunyi/Documents/code/tomato_ai/disease_detection/ml_model/predict.py
# ...existing code...
def predict_disease(image_path):
    print("this is the image path", image_path)
    # ...existing code...
    confidence = predictions[0][class_index]  # Get confidence score
    if confidence < 0.5:  # Threshold for confidence
        return "Unrelated Image", confidence
    class_name = CLASS_NAMES[class_index]  # Map index to class name
    return class_name, confidence
