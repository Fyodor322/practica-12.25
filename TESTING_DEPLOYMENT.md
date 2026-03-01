# Тестирование и развертывание

## 7. Тестирование

### 7.1 Юнит-тесты (pytest)

**Установка:**
```bash
pip install pytest pytest-django
```

**Запуск тестов:**
```bash
cd backend
pytest api/tests.py -v
```

**Покрытие тестами:**
- Модели: UserProfile, Restaurant, Table, Booking, MenuItem, Review, Order
- Связи между моделями
- Валидация данных
- Уникальные ограничения

### 7.2 Нагрузочное тестирование (Locust)

**Установка:**
```bash
pip install locust
```

**Запуск:**
```bash
cd backend
locust -f locustfile.py
```

**Открыть:** http://localhost:8089

**Сценарии тестирования:**
- RestaurantUser: просмотр меню, категорий, создание бронирований
- AdminUser: административные операции, экспорт данных

**Метрики:**
- RPS (requests per second)
- Response time (min, max, avg)
- Failure rate
- Concurrent users

### 7.3 Логирование

**Конфигурация в settings.py:**
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/user_activity.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'user_activity': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
```

**Логируемые события:**
- Действия пользователей (UserActivityMiddleware)
- IP адреса
- User Agent
- Время запросов
- Ошибки

## 8. Развертывание

### 8.1 Development

**Backend:**
```bash
cd backend
python manage.py runserver
```

**Frontend:**
```bash
npm start
```

### 8.2 Production

**Архитектура:**
```
[Клиент (Browser)] 
    ↓ HTTPS
[Nginx (Reverse Proxy + Static Files)]
    ↓
[Gunicorn (WSGI Server)]
    ↓
[Django Application]
    ↓
[PostgreSQL Database]
    ↓
[Media Storage (S3/Local)]
```

**Установка зависимостей:**
```bash
pip install gunicorn psycopg2-binary
```

**Gunicorn конфигурация:**
```bash
gunicorn restaurant_backend.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 \
    --timeout 60 \
    --access-logfile logs/access.log \
    --error-logfile logs/error.log
```

**Nginx конфигурация:**
```nginx
server {
    listen 80;
    server_name bolshayashishka.ru;

    location /static/ {
        alias /var/www/restaurant/static/;
    }

    location /media/ {
        alias /var/www/restaurant/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Сборка Frontend:**
```bash
npm run build
# Копировать build/ в Nginx static directory
```

**Миграции:**
```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 8.3 Docker (опционально)

**Dockerfile (Backend):**
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "restaurant_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: restaurant
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - db
  
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

### 8.4 Мониторинг

**Инструменты:**
- Sentry (отслеживание ошибок)
- Prometheus + Grafana (метрики)
- ELK Stack (логи)

**Health Check endpoint:**
```python
@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok'})
```