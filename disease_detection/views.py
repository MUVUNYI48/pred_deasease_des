from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password  # Import for password validation
from .models import UploadedImage, PredictionResult, CustomUser
from .serializers import UploadedImageSerializer, PredictionResultSerializer, UserSerializer
from .ml_model.predict import predict_disease

@api_view(["POST"])
# @permission_classes([AllowAny])  # Allows anyone to register
def register(request):
    """ API endpoint for user registration """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
# @permission_classes([AllowAny])  # Allows anyone to use this endpoint
def login(request):
    """ API endpoint for user authentication using email and password """
    email = request.data.get("email")
    password = request.data.get("password")

    # Check if email and password are provided
    if not email or not password:
        return Response(
            {"error": "Both email and password are required."}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Get the user with the provided email
        user = CustomUser.objects.filter(email=email).first()
        if not user:
            return Response(
                {"error": f"No user found with email: {email}."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if the user's account is active
        if not user.is_active:
            return Response(
                {"error": "This account is inactive."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Validate the password
        if check_password(password, user.password):
            # Password is correct, generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "username": user.username,
                "email": user.email,
                "fullname": user.fullname
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Incorrect password."}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

    except Exception as e:
        return Response(
            {"error": f"Login error: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# @api_view(["POST"])
# def upload_image(request):
#     """ API endpoint for uploading an image and predicting disease """
    
#     # Manually check if user is authenticated
#     if not request.user or not request.user.is_authenticated:
#         return Response({"error": "User is not authenticated. Please log in first."}, status=status.HTTP_401_UNAUTHORIZED)

#     serializer = UploadedImageSerializer(data=request.data)
#     if serializer.is_valid():
#         image = serializer.validated_data["image"]
#         saved_path = default_storage.save(f"uploaded_images/{image.name}", image)

#         class_name, confidence = predict_disease(saved_path)

#         uploaded_image = UploadedImage.objects.create(image=saved_path, predicted_disease=class_name)
#         prediction = PredictionResult.objects.create(image=saved_path, class_name=class_name, confidence=confidence)

#         return Response({
#             "prediction": class_name,
#             "confidence": confidence,
#             "image_id": uploaded_image.id
#         }, status=status.HTTP_201_CREATED)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def upload_image(request):
    """ API endpoint for uploading an image and predicting disease """
    
    # Check if Authorization Header exists
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return Response({"error": "Missing authentication token."}, status=status.HTTP_401_UNAUTHORIZED)

    serializer = UploadedImageSerializer(data=request.data)
    if serializer.is_valid():
        image = serializer.validated_data["image"]
        saved_path = default_storage.save(f"uploaded_images/{image.name}", image)

        class_name, confidence = predict_disease(saved_path)

        uploaded_image = UploadedImage.objects.create(image=saved_path, predicted_disease=class_name)
        prediction = PredictionResult.objects.create(image=saved_path, class_name=class_name, confidence=confidence)
        print("information saved in database:",prediction)

        return Response({
            "prediction": class_name,
            "confidence": confidence,
            "image_id": uploaded_image.id,
            "image_name": image.name,  # Return the name of the uploaded image
            "message":"uploaded successfully",# Return the ID of the prediction
            "image_url": default_storage.url(saved_path)  # Return the URL of the uploaded image

        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"])
# @permission_classes([IsAuthenticated])  # Requires authentication to list predictions
def list_predictions(request):
    """ API endpoint to retrieve all predictions """
    
    auth_header=request.headers.get("Authorization")
    if not auth_header:
        return Response({"error":"Missing authentication token."}, status=status.HTTP_401_UNAUTHORIZED)

    predictions = PredictionResult.objects.all()
    serializer = PredictionResultSerializer(predictions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
#@permission_classes([IsAuthenticated])  # Requires authentication to delete predictions
def delete_prediction(request, pk):
    """ API endpoint to delete a specific prediction """
     
    auth_header=request.headers.get("Authorization")
    if not auth_header:
        return Response({"error":"Missing authentication token."}, status=status.HTTP_401_UNAUTHORIZED)

    prediction = get_object_or_404(PredictionResult, pk=pk)
    prediction.delete()
    return Response({"message": "Prediction deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
#@permission_classes([IsAuthenticated])  # Requires authentication to view dashboard
def dashboard(request):
    """ API endpoint to retrieve summary statistics """
    stats = {
        "total_images": UploadedImage.objects.count(),
        "total_predictions": PredictionResult.objects.count(),
        "latest_prediction": PredictionResultSerializer(PredictionResult.objects.order_by("-created_at").first()).data,
        "latest_image": UploadedImageSerializer(UploadedImage.objects.order_by("-uploaded_at").first()).data,
    }
    return Response(stats, status=status.HTTP_200_OK)



@api_view(["GET"])
@permission_classes([AllowAny])
def debug_users(request):
    """Temporary endpoint to debug user authentication issues"""
    try:
        # List all users
        users = CustomUser.objects.all()
        user_data = [{"username": user.username, "fullname": user.fullname} for user in users]
        
        # Check if our test user exists
        test_user_exists = CustomUser.objects.filter(username="patrickdoe1").exists()
        
        # Create test user if needed
        if not test_user_exists:
            CustomUser.objects.create_user(
                username="patrickdoe1",
                fullname="Patrick Doe",
                password="password2"
            )
            message = "Test user created successfully"
        else:
            # Reset password for existing user
            user = CustomUser.objects.get(username="patrickdoe1")
            user.set_password("password2")
            user.save()
            message = "Test user password reset"
        
        return Response({
            "message": message,
            "users": user_data,
            "count": len(user_data)
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)