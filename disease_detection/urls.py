from django.urls import path
from .views import register,change_password,forgot_password,prediction_detail, login,delete_account, upload_image, list_predictions, delete_prediction, dashboard,get_current_user,list_users,create_user,update_user,delete_user
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
   path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('upload/', upload_image, name='api-upload'),
    path('predictions/', list_predictions, name='api-predictions'),
    # path('predictions/<int:pk>/', prediction_detail, name='api-prediction-detail'),
    path("predictions/user/<int:user_id>/", prediction_detail, name="api-user-predictions"),  #  Get personalized predictions
    path('predictions/<int:pk>/delete/', delete_prediction, name='api-delete-prediction'),
    path('dashboard/', dashboard, name='api-dashboard'),
    path('auth/user/', get_current_user, name='api-get-current-user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),  # JWT refresh token
    path("auth/forgot-password/", forgot_password, name="forgot-password"),
    path("auth/change-password/", change_password, name="change-password"),
    
]


urlpatterns += [
    path("admin/users/", list_users, name="admin-list-users"),
    path("admin/users/create/", create_user, name="admin-create-user"),
    path("admin/users/<int:pk>/update/", update_user, name="admin-update-user"),
    path("admin/users/<int:pk>/delete/", delete_user, name="admin-delete-user"),
    path("account/delete/", delete_account, name="delete-account"),
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
