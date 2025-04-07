from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UploadedImage, PredictionResult

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password1', 'password2']

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        user = User.objects.create(username=validated_data['username'])
        user.set_password(validated_data['password1'])  # Hash password
        user.save()
        return user

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = '__all__'

class PredictionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionResult
        fields = '__all__'
