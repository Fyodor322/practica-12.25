from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birth_date = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
        indexes = [models.Index(fields=['user'])]
    
    def __str__(self):
        return f"Profile of {self.user.username}"

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return self.name

class MenuItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    image = models.ImageField(upload_to='menu_items/', blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'menu_items'
        indexes = [models.Index(fields=['category', 'is_available'])]
    
    def __str__(self):
        return self.name

class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    phone = models.CharField(max_length=20)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    capacity = models.IntegerField(validators=[MinValueValidator(1)])
    
    class Meta:
        db_table = 'restaurants'
    
    def __str__(self):
        return f"{self.name} - {self.address}"

class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='tables')
    number = models.IntegerField()
    seats = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(20)])
    zone = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'tables'
        unique_together = ['restaurant', 'number']
        indexes = [models.Index(fields=['restaurant', 'is_active'])]
    
    def __str__(self):
        return f"Table {self.number} at {self.restaurant.name}"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
        ('completed', 'Завершено'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateField()
    time = models.TimeField()
    guests = models.IntegerField(validators=[MinValueValidator(1)])
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    special_requests = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['table', 'date', 'time']),
        ]
    
    def __str__(self):
        return f"Booking {self.id} - {self.user.username} at {self.table}"

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        unique_together = ['user', 'menu_item']
        indexes = [models.Index(fields=['menu_item', 'rating'])]
    
    def __str__(self):
        return f"Review by {self.user.username} for {self.menu_item.name}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'В обработке'),
        ('confirmed', 'Подтверждён'),
        ('preparing', 'Готовится'),
        ('ready', 'Готов'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменён'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    class Meta:
        db_table = 'order_items'
    
    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Наличные'),
        ('card', 'Карта'),
        ('online', 'Онлайн'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('completed', 'Завершён'),
        ('failed', 'Ошибка'),
        ('refunded', 'Возврат'),
    ]
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'payments'
        indexes = [models.Index(fields=['order', 'status'])]
    
    def __str__(self):
        return f"Payment {self.id} for Order {self.order.id}"

class Notification(models.Model):
    TYPE_CHOICES = [
        ('booking', 'Бронирование'),
        ('order', 'Заказ'),
        ('promotion', 'Акция'),
        ('system', 'Системное'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

class Promotion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    discount_percent = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    menu_items = models.ManyToManyField(MenuItem, related_name='promotions', blank=True)
    
    class Meta:
        db_table = 'promotions'
        indexes = [models.Index(fields=['is_active', 'start_date', 'end_date'])]
    
    def __str__(self):
        return self.title

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=100)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_activities'
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['action']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.action}"

class FileUpload(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploads')
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    original_name = models.CharField(max_length=255)
    file_size = models.BigIntegerField()
    mime_type = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'file_uploads'
        indexes = [models.Index(fields=['user', 'created_at'])]
    
    def __str__(self):
        return f"{self.original_name} by {self.user.username}"