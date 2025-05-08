from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import UploadedImage, PredictionResult, CustomUser
from .serializers import UserSerializer, UploadedImageSerializer, PredictionResultSerializer
from .ml_model.predict import predict_disease
from rest_framework_simplejwt.tokens import AccessToken
from django.core.mail import send_mail
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import default_token_generator
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.pagination import PageNumberPagination
import os



@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    data = request.data.copy()
    
    if "username" not in data:  # Auto-generate username if missing
        data["username"] = data["email"].split("@")[0]

    serializer = UserSerializer(data=data)
    
    if serializer.is_valid():
        user = serializer.save()  
        user_data = UserSerializer(user).data  

        return Response({
            "message": "User created successfully",
            "user_id": user.id,
            "user": user_data 
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({
            'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST)

    # Find user by email
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    #  Manually Validate Password
    if not user.check_password(password):  # Directly verify password against stored hash
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'fullname': user.fullname,
            'phone': user.phone_number,
            
        }
    })   
    


def validate_token_and_get_user(request):
    """
    Validates JWT token and returns authenticated user or error response.
    
    Args:
        request: Django request object
        
    Returns:
        tuple: (user_object, error_response) or (None, error_response)
    """
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        error = {'error': 'Authorization header missing or invalid'}
        return None, Response(error, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        token = auth_header.split(' ')[1]
        decoded_token = AccessToken(token)
        user = CustomUser.objects.get(id=decoded_token['user_id'])
        return user, None
        
    except CustomUser.DoesNotExist:
        error = {'error': 'User not found'}
        return None, Response(error, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        error = {'error': f'Invalid token: {str(e)}'}
        return None, Response(error, status=status.HTTP_401_UNAUTHORIZED)


CLASS_NAMES = {
    "Bacterial Spot": "Apply copper-based fungicides and avoid overhead watering.",
    "Early Blight": "Use fungicides with chlorothalonil and remove affected leaves.",
    "Late Blight": "Destroy infected plants and apply systemic fungicides.",
    "Leaf Mold": "Improve air circulation and apply fungicides containing mancozeb.",
    "Septoria Leaf Spot": "Avoid watering leaves and apply fungicides regularly.",
    "Spider Mites": "Spray neem oil or insecticidal soap to control infestation.",
    "Target Spot": "Apply organic fungicides and avoid excessive humidity.",
    "Yellow Leaf Curl Virus": "Control whiteflies and use virus-resistant varieties.",
    "Mosaic Virus": "Remove infected plants and disinfect garden tools.",
    "Healthy": "Maintain good soil health and regular watering.",
    "Other": "Monitor plant health and apply general care techniques."
}

@api_view(["POST"])
def upload_image(request):
    """
    Handles image upload and disease prediction.
    Access: All authenticated users
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response

    serializer = UploadedImageSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        image = serializer.validated_data["image"]
        saved_path = f"uploaded_images/{image.name}"
        
        # Save uploaded file
        with open(saved_path, "wb+") as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        
        # Get prediction
        class_name, confidence = predict_disease(saved_path)  # ✅ Ignore recommendation from function
        
        # ✅ Fetch recommendation from CLASS_NAMES dictionary
        recommendation = CLASS_NAMES.get(class_name, "No specific recommendation available.")
        
        # Save to database
        uploaded_image = UploadedImage.objects.create(
            user=user,
            image=saved_path,
            predicted_disease=class_name
        )
        
        prediction = PredictionResult.objects.create(
            user=user,
            image=saved_path,
            class_name=class_name,
            confidence=confidence,
            recommendation=recommendation  # ✅ Store recommendation based on detected disease
        )
        
        response_data = {
            "prediction": class_name,
            "confidence": float(confidence),
            "recommendation": recommendation,  # ✅ Include recommendation in response
            "image_url": uploaded_image.image.url,
            "user_id": user.id
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        error = {"error": f"Processing failed: {str(e)}"}
        return Response(error, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# @api_view(['GET'])
# def list_predictions(request):
#     """
#     Returns list of predictions.
#     Access: Superusers get all predictions, regular users get only theirs
#     """
#     user, error_response = validate_token_and_get_user(request)
#     if error_response:
#         return error_response

#     predictions = (PredictionResult.objects.all() if user.is_superuser 
#                   else PredictionResult.objects.filter(user=user))
    
#     predictions = predictions.order_by('-created_at')
#     serializer = PredictionResultSerializer(predictions, many=True)
    
#     return Response(serializer.data)




class CustomPagination(PageNumberPagination):
    page_size = 10  # ✅ Default items per page
    page_size_query_param = "page_size"
    max_page_size = 50  # ✅ Allow up to 50 items per page

@api_view(["GET"])
def list_predictions(request):
    """
    Returns paginated predictions.
    - Superusers get all predictions.
    - Regular users get only their own predictions.
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response

    # ✅ Superuser gets ALL predictions (No filter)
    if user.is_superuser:
        predictions = PredictionResult.objects.all()
    else:
        # ✅ Regular users get ONLY their own predictions
        predictions = PredictionResult.objects.filter(user=user)

    predictions = predictions.order_by("-created_at")

    # ✅ Apply pagination correctly
    paginator = CustomPagination()
    paginated_predictions = paginator.paginate_queryset(predictions, request)

    serializer = PredictionResultSerializer(paginated_predictions, many=True)
    
    return paginator.get_paginated_response(serializer.data)



@api_view(["GET"])
def prediction_detail(request, user_id):
    """
    Returns all predictions for a specific user ID.
    - Superusers can view any user's predictions.
    - Regular users can only view their own predictions.
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response

    # if not user.is_superuser and user.id != user_id:
    #     return Response({"error": "Unauthorized access to these predictions."}, status=status.HTTP_403_FORBIDDEN)

    predictions = PredictionResult.objects.filter(user_id=user_id).order_by("-created_at")

    if not predictions.exists():
        return Response({"error": "No predictions found for this user."}, status=status.HTTP_404_NOT_FOUND)

    serializer = PredictionResultSerializer(predictions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)




@api_view(['DELETE'])
def delete_prediction(request, pk):
    """
    Deletes a specific prediction.
    Access: Superusers can delete any, regular users only theirs
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response

    # Get prediction with appropriate permission check
    if user.is_superuser:
        prediction = get_object_or_404(PredictionResult, pk=pk)
    else:
        prediction = get_object_or_404(PredictionResult, pk=pk, user=user)
    
    # Clean up associated file
    if prediction.image and os.path.isfile(prediction.image.path):
        os.remove(prediction.image.path)
    
    prediction.delete()
    
    return Response(
        {'message': 'Prediction deleted successfully'},
        status=status.HTTP_204_NO_CONTENT
    )


@api_view(['GET'])
def dashboard(request):
    """
    Returns dashboard statistics.
    Access: Superusers get system-wide stats, regular users get personal stats
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response

    base_stats = {
        'user_info': {
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser
        }
    }

    if user.is_superuser:
        stats = {
            **base_stats,
            'total_images': UploadedImage.objects.count(),
            'total_predictions': PredictionResult.objects.count(),
            'total_users': CustomUser.objects.count(),
            'recent_predictions': PredictionResultSerializer(
                PredictionResult.objects.all().order_by('-created_at')[:5],
                many=True
            ).data
        }
    else:
        stats = {
            **base_stats,
            'total_images': UploadedImage.objects.filter(user=user).count(),
            'total_predictions': PredictionResult.objects.filter(user=user).count(),
            'recent_predictions': PredictionResultSerializer(
                PredictionResult.objects.filter(user=user)
                .order_by('-created_at')[:5],
                many=True
            ).data
        }
    
    return Response(stats)


@api_view(['GET'])
def get_current_user(request):
    """
    Returns current authenticated user's information.
    Access: All authenticated users
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'fullname': user.fullname,
        'is_superuser': user.is_superuser,
        'is_staff': user.is_staff
    })
    
    
# crud operations on user must be done by super admin    
    
    
def is_super_admin(user):
        return user.is_authenticated and user.is_super_admin  # ✅ Super Admin check



@api_view(["POST"])
def create_user(request):
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response  # Return error if token is invalid

    # if not is_super_admin(user):
        # return Response({"error": "Only Super Admin can create users."}, status=status.HTTP_403_FORBIDDEN)
    
    if user.is_superuser:

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def list_users(request):
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response  # Return error if token is invalid

    # if not is_super_admin(user):
    #     return Response({"error": "Only Super Admin can list users."}, status=status.HTTP_403_FORBIDDEN)
    
    if user.is_superuser:

        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    else:
        return Response({"error": "Only Super Admin can list users."}, status=status.HTTP_403_FORBIDDEN)


@api_view(["PUT", "PATCH"])
def update_user(request, pk):
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response  # Return error if token is invalid

    # if not is_super_admin(user):
    #     return Response({"error": "Only Super Admin can update users."}, status=status.HTTP_403_FORBIDDEN)

    if user.is_superuser or not user.is_superuser:
        
        print("user is superuser", user.is_superuser)
    
        try:
            user_to_update = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user_to_update, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["DELETE"])
def delete_user(request, pk):
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response  # Return error if token is invalid

    # if not is_super_admin(user):
    #     return Response({"error": "Only Super Admin can delete users."}, status=status.HTTP_403_FORBIDDEN)
    
    if user.is_superuser :

        try:
            user_to_delete = CustomUser.objects.get(pk=pk)
            user_to_delete.delete();
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(["POST"])
def forgot_password(request):
    """
    Handles password reset request by sending a reset link.
    Access: Open to all users
    """
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
        token = default_token_generator.make_token(user)
        reset_link = f"http://127.0.0.1:8000/auth/reset-password/{user.pk}/{token}/"

        send_mail(
            subject="Password Reset Request",
            message=f"Click the link below to reset your password:\n{reset_link}",
            from_email="no-reply@yourdomain.com",
            recipient_list=[email],
        )

        return Response({"message": "Password reset link sent successfully."}, status=status.HTTP_200_OK)

    except CustomUser.DoesNotExist:
        return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
# delete user account  
      
@api_view(["DELETE"])
def delete_account(request):
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response  # Return error if token is invalid

    try:
        user.delete()
        return Response({"message": "Account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"error": f"Error deleting account: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
@api_view(["POST"])
def change_password(request):
    """
    Allows users to change their password by verifying the current password.
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response  # Return error if token is invalid

    # Extract password fields from request
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    # Validate inputs
    if not current_password or not new_password or not confirm_password:
        return Response({"error": "All fields are required."
            }, status=status.HTTP_400_BAD_REQUEST)

    if new_password != confirm_password:
        return Response({
            "error": "New password and confirm password do not match."
            }, status=status.HTTP_400_BAD_REQUEST)

    # Check if current password is correct
    if not check_password(current_password, user.password):
        return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

    # Update password
    user.set_password(new_password)
    user.save()

    return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)