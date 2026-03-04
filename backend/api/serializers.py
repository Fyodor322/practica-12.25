from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    avatar = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = '__all__'
    
    def get_avatar(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    birth_date = serializers.DateField(required=False)
    phone = serializers.CharField(required=False, max_length=20)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'birth_date', 'phone']
    
    def validate_username(self, value):
        """Валидация имени пользователя"""
        if len(value) < 3:
            raise serializers.ValidationError("Имя пользователя должно быть минимум 3 символа")
        if not value.isalnum():
            raise serializers.ValidationError("Имя пользователя может содержать только буквы и цифры")
        return value
    
    def validate_email(self, value):
        """Валидация email"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value.lower()
    
    def validate_password(self, value):
        """Валидация пароля"""
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну цифру")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну заглавную букву")
        return value
    
    def validate_phone(self, value):
        """Валидация телефона"""
        if value and not value.startswith('+'):
            raise serializers.ValidationError("Телефон должен начинаться с +")
        return value
    
    def validate(self, data):
        """Общая валидация данных"""
        if data.get('first_name') and data.get('last_name'):
            if data['first_name'] == data['last_name']:
                raise serializers.ValidationError("Имя и фамилия не могут быть одинаковыми")
        return data
    
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