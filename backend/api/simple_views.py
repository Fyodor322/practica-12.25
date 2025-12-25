from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login
import json

@csrf_exempt
@require_http_methods(["POST"])
def simple_login(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        print(f"Попытка входа: {username}")
        
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({'message': 'Успешный вход'})
        else:
            return JsonResponse({'error': 'Неверные данные'}, status=401)
    except Exception as e:
        print(f"Ошибка: {e}")
        return JsonResponse({'error': str(e)}, status=500)