from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UploadedImage, PredictionResult
from .serializers import UploadedImageSerializer, PredictionResultSerializer, UserSerializer
from .ml_model.predict import predict_disease


@api_view(['POST'])
@permission_classes([AllowAny])  # Allows anyone to register
def register(request):
    """ API endpoint for user registration """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Account created successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])  # Allows login without authentication
def login(request):
    """ API endpoint for user authentication """
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
# @permission_classes([IsAuthenticated]) 
@permission_classes([AllowAny])
def upload_image(request):
    """ API endpoint for uploading an image and predicting disease """
    serializer = UploadedImageSerializer(data=request.data)
    if serializer.is_valid():
        image = serializer.validated_data['image']
        saved_path = default_storage.save(f"uploaded_images/{image.name}", image)

        class_name, confidence = predict_disease(saved_path)

        uploaded_image = UploadedImage.objects.create(image=saved_path, predicted_disease=class_name)
        prediction = PredictionResult.objects.create(image=saved_path, class_name=class_name, confidence=confidence)

        return Response({
            "prediction": class_name,
            "confidence": confidence,
            "image_id": uploaded_image.id
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])

def list_predictions(request):
    """ API endpoint to retrieve all predictions """
    predictions = PredictionResult.objects.all()
    serializer = PredictionResultSerializer(predictions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])  # Allows anyone to register

def delete_prediction(request, pk):
    """ API endpoint to delete a specific prediction """
    prediction = get_object_or_404(PredictionResult, pk=pk)
    prediction.delete()
    return Response({'message': 'Prediction deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
# @permission_classes([IsAuthenticated])
@permission_classes([AllowAny])  # Allows anyone to register
def dashboard(request):
    """ API endpoint to retrieve summary statistics """
    stats = {
        'total_images': UploadedImage.objects.count(),
        'total_predictions': PredictionResult.objects.count(),
        'latest_prediction': PredictionResultSerializer(PredictionResult.objects.order_by('-created_at').first()).data,
        'latest_image': UploadedImageSerializer(UploadedImage.objects.order_by('-uploaded_at').first()).data,
    }
    return Response(stats, status=status.HTTP_200_OK)
