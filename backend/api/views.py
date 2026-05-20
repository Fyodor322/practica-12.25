from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import UserProfile, MenuItem, Category
from .serializers import (
    UserProfileSerializer, UserRegistrationSerializer, MenuItemSerializer
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


@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_reviews(request):
    # Всегда возвращаем тестовые отзывы
    data = [
        {
            'id': 1,
            'rating': 5,
            'comment': 'Отличное заведение! Крафтовое пиво просто потрясающее, а ребра тают во рту. Обязательно вернусь!',
            'created_at': '2024-01-10T18:30:00Z',
            'menu_item': 'Сет из колбасок к коктейлям'
        },
        {
            'id': 2,
            'rating': 4,
            'comment': 'Уютная атмосфера, вкусная еда. Немного долго ждали заказ, но в целом очень доволен. Рекомендую!',
            'created_at': '2024-01-05T14:20:00Z',
            'menu_item': 'Первый шаг'
        }
    ]
    return Response(data)

@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def menu_list(request):
    """Получение списка блюд для меню"""
    try:
        # Получаем все блюда
        menu_items = MenuItem.objects.all()
        serializer = MenuItemSerializer(menu_items, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    """Создание заказа на доставку"""
    try:
        # В реальном приложении здесь была бы логика создания заказа
        # и сохранения в базе данных
        
        # Для демонстрации просто возвращаем успешный ответ
        return Response({
            'message': 'Заказ успешно создан',
            'order_id': 12345,
            'estimated_delivery': '30-45 минут'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
