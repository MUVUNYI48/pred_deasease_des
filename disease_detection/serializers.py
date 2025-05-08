from rest_framework import serializers
from .models import CustomUser, UploadedImage, PredictionResult
from rest_framework.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "fullname", "password", "confirm_password", "district", "phone_number", "image_profile"]

    def validate(self, data):
        password = data.get("password")  # ✅ Safely retrieve password
        confirm_password = data.get("confirm_password")  # ✅ Safely retrieve confirm_password

        if password and confirm_password and password != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        if "username" in data and CustomUser.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError({"username": "Username is already taken."})

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")  # Remove unnecessary confirm_password field
        
        return CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            fullname=validated_data["fullname"],
            phone_number=validated_data["phone_number"],
            district=validated_data["district"],
            password=validated_data["password"],
            image_profile=validated_data.get("image_profile")  #  Use correct field name
        )


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