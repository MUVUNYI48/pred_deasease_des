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
from rest_framework.exceptions import AuthenticationFailed
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')  # Still accept email from frontend
    password = request.data.get('password')

    # Get user by email first
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    # Authenticate using username
    # user = authenticate(request, username=user.username, password=password)
    # print("Authenticated user:", user)

    user = CustomUser.objects.get(email="test@example.com")
    print(user.check_password("test123"))  # Should return True

    # user = authenticate(request, username=user.username, password=request.data.get('password'))

    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
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


@api_view(['POST'])
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
        image = serializer.validated_data['image']
        saved_path = f"uploaded_images/{image.name}"
        
        # Save uploaded file
        with open(saved_path, 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        
        # Get prediction from ML model
        class_name, confidence = predict_disease(saved_path)
        
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
            confidence=confidence
        )
        
        response_data = {
            'prediction': class_name,
            'confidence': float(confidence),
            'image_url': uploaded_image.image.url,
            'user_id': user.id
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        error = {'error': f'Processing failed: {str(e)}'}
        return Response(error, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def list_predictions(request):
    """
    Returns list of predictions.
    Access: Superusers get all predictions, regular users get only theirs
    """
    user, error_response = validate_token_and_get_user(request)
    if error_response:
        return error_response

    predictions = (PredictionResult.objects.all() if user.is_superuser 
                  else PredictionResult.objects.filter(user=user))
    
    predictions = predictions.order_by('-created_at')
    serializer = PredictionResultSerializer(predictions, many=True)
    
    return Response(serializer.data)


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