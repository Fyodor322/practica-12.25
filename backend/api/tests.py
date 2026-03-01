import pytest
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, time
from api.models import (
    UserProfile, Restaurant, Table, Booking, 
    Category, MenuItem, Review, Order, OrderItem
)

@pytest.mark.django_db
class TestUserProfile:
    def test_create_user_profile(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        profile = UserProfile.objects.create(
            user=user,
            phone='+7-999-999-99-99',
            birth_date=date(1990, 1, 1)
        )
        assert profile.user == user
        assert profile.phone == '+7-999-999-99-99'
        assert str(profile) == f"Profile of {user.username}"

@pytest.mark.django_db
class TestRestaurant:
    def test_create_restaurant(self):
        restaurant = Restaurant.objects.create(
            name='Тестовый ресторан',
            address='Тестовая улица 1',
            phone='+7-999-999-99-99',
            opening_time=time(10, 0),
            closing_time=time(22, 0),
            capacity=50
        )
        assert restaurant.name == 'Тестовый ресторан'
        assert restaurant.capacity == 50

@pytest.mark.django_db
class TestTable:
    def test_create_table(self):
        restaurant = Restaurant.objects.create(
            name='Ресторан',
            address='Адрес',
            phone='+7-999-999-99-99',
            opening_time=time(10, 0),
            closing_time=time(22, 0),
            capacity=50
        )
        table = Table.objects.create(
            restaurant=restaurant,
            number=1,
            seats=4,
            zone='Центр'
        )
        assert table.number == 1
        assert table.seats == 4
        assert table.restaurant == restaurant

@pytest.mark.django_db
class TestBooking:
    def test_create_booking(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        restaurant = Restaurant.objects.create(
            name='Ресторан',
            address='Адрес',
            phone='+7-999-999-99-99',
            opening_time=time(10, 0),
            closing_time=time(22, 0),
            capacity=50
        )
        table = Table.objects.create(
            restaurant=restaurant,
            number=1,
            seats=4,
            zone='Центр'
        )
        booking = Booking.objects.create(
            user=user,
            table=table,
            date=date.today(),
            time=time(18, 0),
            guests=2,
            status='pending'
        )
        assert booking.user == user
        assert booking.table == table
        assert booking.guests == 2
        assert booking.status == 'pending'

@pytest.mark.django_db
class TestMenuItem:
    def test_create_menu_item(self):
        category = Category.objects.create(name='Основные блюда')
        item = MenuItem.objects.create(
            name='Тестовое блюдо',
            description='Описание',
            price=500.00,
            category=category,
            is_available=True
        )
        assert item.name == 'Тестовое блюдо'
        assert item.price == 500.00
        assert item.category == category

@pytest.mark.django_db
class TestReview:
    def test_create_review(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        category = Category.objects.create(name='Основные блюда')
        item = MenuItem.objects.create(
            name='Блюдо',
            description='Описание',
            price=500.00,
            category=category
        )
        review = Review.objects.create(
            user=user,
            menu_item=item,
            rating=5,
            comment='Отличное блюдо!'
        )
        assert review.rating == 5
        assert review.user == user
        assert review.menu_item == item

@pytest.mark.django_db
class TestOrder:
    def test_create_order_with_items(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        restaurant = Restaurant.objects.create(
            name='Ресторан',
            address='Адрес',
            phone='+7-999-999-99-99',
            opening_time=time(10, 0),
            closing_time=time(22, 0),
            capacity=50
        )
        category = Category.objects.create(name='Основные блюда')
        item = MenuItem.objects.create(
            name='Блюдо',
            description='Описание',
            price=500.00,
            category=category
        )
        
        order = Order.objects.create(
            user=user,
            restaurant=restaurant,
            status='pending',
            total_amount=1000.00
        )
        
        order_item = OrderItem.objects.create(
            order=order,
            menu_item=item,
            quantity=2,
            price=500.00
        )
        
        assert order.user == user
        assert order.total_amount == 1000.00
        assert order.items.count() == 1
        assert order_item.quantity == 2

@pytest.mark.django_db
class TestUserProfileUnique:
    def test_one_profile_per_user(self):
        user = User.objects.create_user(username='testuser', password='testpass123')
        profile1 = UserProfile.objects.create(user=user)
        
        # Попытка создать второй профиль должна вызвать ошибку
        with pytest.raises(Exception):
            profile2 = UserProfile.objects.create(user=user)