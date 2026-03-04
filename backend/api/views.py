from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import (
    UserProfileSerializer, UserRegistrationSerializer
)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'Пользователь успешно зарегистрирован'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f"Попытка входа: {username}")  # Отладка
    
    # Проверяем существует ли пользователь
    try:
        user_exists = User.objects.get(username=username)
        print(f"Пользователь найден: {user_exists.username}")
    except User.DoesNotExist:
        print("Пользователь не найден")
        return Response({'error': 'Пользователь не найден'}, status=status.HTTP_401_UNAUTHORIZED)
    
    user = authenticate(request, username=username, password=password)
    if user:
        if user.is_active:
            login(request, user)
            print(f"Успешный вход: {user.username}")  # Отладка
            return Response({'message': 'Успешный вход'}, status=status.HTTP_200_OK)
        else:
            print("Пользователь неактивен")
            return Response({'error': 'Аккаунт неактивен'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        print("Неверный пароль")  # Отладка
        return Response({'error': 'Неверный пароль'}, status=status.HTTP_401_UNAUTHORIZED)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)
    return Response({'message': 'Выход выполнен'}, status=status.HTTP_200_OK)

@csrf_exempt
@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        # Обновляем данные пользователя
        user_data = {
            'first_name': request.data.get('first_name', request.user.first_name),
            'last_name': request.data.get('last_name', request.user.last_name),
            'email': request.data.get('email', request.user.email),
        }
        
        for key, value in user_data.items():
            setattr(request.user, key, value)
        request.user.save()
        
        # Обновляем профиль
        if request.data.get('birth_date'):
            profile.birth_date = request.data.get('birth_date')
        if request.data.get('phone'):
            profile.phone = request.data.get('phone')
        
        # Обновляем аватар если загружен
        if 'avatar' in request.FILES:
            profile.avatar = request.FILES['avatar']
        
        profile.save()
        
        serializer = UserProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)