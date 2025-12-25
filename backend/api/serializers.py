from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    birth_date = serializers.DateField(required=False)
    phone = serializers.CharField(required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'birth_date', 'phone']
    
    def create(self, validated_data):
        birth_date = validated_data.pop('birth_date', None)
        phone = validated_data.pop('phone', '')
        
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(
            user=user,
            birth_date=birth_date,
            phone=phone
        )
        return user