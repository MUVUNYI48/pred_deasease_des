from rest_framework import serializers
from .models import CustomUser, UploadedImage, PredictionResult
from rest_framework.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'fullname', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            fullname=validated_data['fullname'],
            password=validated_data['password']
        )
        return user

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['image']  # Frontend only needs to send the image file

class PredictionResultSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PredictionResult
        fields = ['id', 'image_url', 'class_name', 'confidence', 'created_at']

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None