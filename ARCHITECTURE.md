# Архитектура проекта "Большая Шишка"

## 1. Анализ требований и проектирование архитектуры

### 1.1 Функциональные требования
- Регистрация и авторизация пользователей
- Просмотр меню ресторана
- Бронирование столиков с выбором конкретного места
- Управление профилем пользователя
- Просмотр отзывов на блюда
- Система уведомлений

### 1.2 Нефункциональные требования
- Адаптивный дизайн (320px - 2560px)
- Безопасность (CSRF, XSS защита)
- Производительность (оптимизация запросов к БД)
- Масштабируемость архитектуры

### 1.3 Архитектура приложения

#### Клиент-серверное взаимодействие
```
[React Frontend] <--HTTP/REST API--> [Django Backend] <--> [SQLite Database]
     |                                       |
     |                                       |
  [Browser]                            [Media Files]
```

#### Слои приложения

**Frontend (React)**
- Components: Header, Footer, переиспользуемые компоненты
- Pages: Home, Menu, About, Profile, Booking, SignIn, Registration
- Services: API calls, authentication
- Styles: App.css с адаптивным дизайном

**Backend (Django)**
- Models: 15 таблиц с ORM
- Views: API views с DRF
- Serializers: Валидация и сериализация данных
- URLs: Маршрутизация API endpoints
- Middleware: CORS, CSRF, Authentication

### 1.4 Ключевые сущности

**Основные модели:**
1. User (встроенная Django)
2. UserProfile - профиль пользователя
3. Category - категории меню
4. MenuItem - блюда
5. Restaurant - рестораны
6. Table - столики
7. Booking - бронирования
8. Review - отзывы
9. Order - заказы
10. OrderItem - позиции заказа
11. Payment - платежи
12. Notification - уведомления
13. Promotion - акции
14. UserActivity - логи активности
15. FileUpload - загруженные файлы

**Связи:**
- User 1:1 UserProfile
- Category 1:N MenuItem
- Restaurant 1:N Table
- Table 1:N Booking
- User 1:N Booking
- MenuItem 1:N Review
- User 1:N Review
- User 1:N Order
- Order 1:N OrderItem
- Order 1:1 Payment
- User 1:N Notification
- MenuItem N:M Promotion

## 2. API Endpoints

### Аутентификация
- POST /api/register/ - Регистрация
- POST /api/login/ - Вход
- POST /api/logout/ - Выход

### Профиль
- GET /api/profile/ - Получить профиль
- PUT /api/profile/ - Обновить профиль

### Меню
- GET /api/menu/ - Список блюд
- GET /api/categories/ - Категории

### Бронирование
- GET /api/bookings/ - Список бронирований
- POST /api/bookings/ - Создать бронирование
- GET /api/restaurants/ - Список ресторанов
- GET /api/tables/ - Доступные столики

## 3. Технологический стек

**Frontend:**
- React 18
- React Router DOM
- CSS3 (Flexbox, Grid, Media Queries)
- Google Fonts

**Backend:**
- Django 4.2
- Django REST Framework
- SQLite
- Pillow (обработка изображений)

**Безопасность:**
- CSRF protection (отключен для API)
- CORS настроен
- Session authentication
- Password hashing (Django default)

## 4. Структура базы данных

См. models.py - 15 таблиц с:
- Индексами для оптимизации
- Foreign Keys с CASCADE
- Валидаторами
- Unique constraints
- Meta классами

## 5. Развёртывание

**Development:**
- Frontend: localhost:3000 (React Dev Server)
- Backend: localhost:8000 (Django runserver)

**Production (рекомендуется):**
- Frontend: Nginx + статические файлы
- Backend: Gunicorn + Django
- Database: PostgreSQL
- Media: S3 или локальное хранилище
- Reverse Proxy: Nginx