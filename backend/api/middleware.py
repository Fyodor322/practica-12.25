import logging
from django.utils.deprecation import MiddlewareMixin
from .models import UserActivity

logger = logging.getLogger('user_activity')

class UserActivityMiddleware(MiddlewareMixin):
    """Middleware для логирования действий пользователей"""
    
    def process_request(self, request):
        if request.user.is_authenticated:
            # Получаем IP адрес
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            
            # Получаем User Agent
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            
            # Определяем действие
            action = f"{request.method} {request.path}"
            
            # Сохраняем в БД
            try:
                UserActivity.objects.create(
                    user=request.user,
                    action=action,
                    description=f"User {request.user.username} accessed {request.path}",
                    ip_address=ip,
                    user_agent=user_agent
                )
            except Exception as e:
                logger.error(f"Failed to log user activity: {e}")
            
            # Логируем в файл
            logger.info(f"User: {request.user.username}, Action: {action}, IP: {ip}")
        
        return None