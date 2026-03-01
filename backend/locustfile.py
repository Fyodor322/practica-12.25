from locust import HttpUser, task, between
import random

class RestaurantUser(HttpUser):
    """Нагрузочное тестирование API ресторана"""
    wait_time = between(1, 3)
    
    def on_start(self):
        """Выполняется при старте каждого пользователя"""
        # Регистрация
        self.client.post("/api/register/", json={
            "username": f"user_{random.randint(1000, 9999)}",
            "email": f"user{random.randint(1000, 9999)}@test.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User"
        })
        
        # Вход
        response = self.client.post("/api/login/", json={
            "username": "testuser",
            "password": "testpass123"
        })
    
    @task(3)
    def view_menu(self):
        """Просмотр меню (частая операция)"""
        self.client.get("/api/menu/")
    
    @task(2)
    def view_categories(self):
        """Просмотр категорий"""
        self.client.get("/api/categories/")
    
    @task(1)
    def view_restaurants(self):
        """Просмотр ресторанов"""
        self.client.get("/api/restaurants/")
    
    @task(1)
    def view_profile(self):
        """Просмотр профиля"""
        self.client.get("/api/profile/")
    
    @task(1)
    def create_booking(self):
        """Создание бронирования"""
        self.client.post("/api/bookings/", json={
            "table": 1,
            "date": "2024-12-25",
            "time": "18:00",
            "guests": 2
        })

class AdminUser(HttpUser):
    """Нагрузочное тестирование админских операций"""
    wait_time = between(2, 5)
    
    @task
    def view_all_bookings(self):
        """Просмотр всех бронирований"""
        self.client.get("/api/bookings/")
    
    @task
    def view_all_orders(self):
        """Просмотр всех заказов"""
        self.client.get("/api/orders/")
    
    @task
    def export_data(self):
        """Экспорт данных"""
        self.client.get("/api/export/bookings/excel/")