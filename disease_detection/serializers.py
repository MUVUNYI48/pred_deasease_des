from rest_framework import serializers
from .models import CustomUser, UploadedImage, PredictionResult
from rest_framework.exceptions import ValidationError

# User Serializer for CustomUser Model
class UserSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(max_length=100, required=True)
    username = serializers.CharField(max_length=150, required=True)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["fullname", "username", "password", "confirm_password"]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise ValidationError({"error": "Passwords do not match. Please try again."})

        if CustomUser.objects.filter(username=data["username"]).exists():
            raise ValidationError({"error": f"Username '{data['username']}' is already taken. Please choose another."})

        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("confirm_password")
        
        # Use create_user method to properly hash password
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            fullname=validated_data["fullname"],
            password=password
        )
        return user

# Serializer for Uploaded Images
class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = "__all__"

# Serializer for Prediction Results
class PredictionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionResult
        fields = "__all__"
