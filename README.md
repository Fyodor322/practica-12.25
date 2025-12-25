# Большая Шишка - Сайт ресторана

Веб-приложение для ресторана "Большая Шишка" с крафтовым пивом и авторской кухней.

## Технологии

### Frontend
- React 18
- React Router DOM
- CSS3 (адаптивный дизайн)

### Backend  
- Django REST Framework
- SQLite

## Функциональность

- Адаптивный дизайн (320px - 2560px)
- Главная страница с информацией о ресторане
- Меню с блюдами и напитками
- Страница "О нас" с историей пивоварни
- Регистрация и авторизация пользователей
- Личный кабинет с редактированием профиля
- Карточки блюд с отзывами

## Установка и запуск

### Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend (React)
```bash
npm install
npm start
```

## Доступ

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Админка**: http://localhost:8000/admin/

## API Endpoints

- `POST /api/register/` - Регистрация
- `POST /api/login/` - Вход
- `POST /api/logout/` - Выход  
- `GET/PUT /api/profile/` - Профиль пользователя

## Структура проекта

```
├── backend/           # Django API
│   ├── api/          # Приложение API
│   └── restaurant_backend/  # Настройки Django
├── src/              # React приложение
│   ├── components/   # Компоненты (Header, Footer)
│   ├── pages/        # Страницы
│   └── App.css       # Стили
└── public/           # Статические файлы
    └── assets/       # Изображения
```