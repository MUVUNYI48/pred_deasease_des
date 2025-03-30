from django.urls import path
from django.contrib.auth import views as auth_views
from . import views  # Add this import

urlpatterns = [
    path('upload/', views.upload_image, name='upload_image'),
    path('results/', views.view_results, name='view_results'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('register/', views.register, name='register'),  # Custom registration view
    path('predictions/', views.list_predictions, name='list_predictions'),
    path('predictions/delete/<int:pk>/', views.delete_prediction, name='delete_prediction'),
]
