from django.urls import path, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
   openapi.Info(
      title="Большая Шишка API",
      default_version='v1',
      description="""
      API для системы управления рестораном "Большая Шишка"
      
      ## Функциональность:
      - Аутентификация и регистрация пользователей
      - Управление профилем
      - Просмотр меню и категорий
      - Бронирование столиков
      - Управление заказами
      - Отзывы на блюда
      - Уведомления
      - Экспорт данных (Excel, Word, PDF)
      - Загрузка файлов
      """,
      terms_of_service="https://www.example.com/terms/",
      contact=openapi.Contact(email="contact@bolshayashishka.ru"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
   path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]