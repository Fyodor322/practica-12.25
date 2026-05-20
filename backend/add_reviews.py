from django.contrib.auth.models import User
from api.models import Review, MenuItem, Category

# Находим пользователя
user = User.objects.get(email='admin@example.com')

# Создаём категорию и блюда если их нет
category, _ = Category.objects.get_or_create(name='Кухня', defaults={'description': 'Основные блюда'})
item1, _ = MenuItem.objects.get_or_create(
    name='Сет из колбасок к пиву',
    defaults={'description': 'Куриные колбаски, свино-говяжьи', 'price': 1100, 'category': category}
)
item2, _ = MenuItem.objects.get_or_create(
    name='Первый шаг Б/А',
    defaults={'description': 'Безалкогольный лагер', 'price': 350, 'category': category}
)

# Создаём отзывы
Review.objects.get_or_create(
    user=user,
    menu_item=item1,
    defaults={
        'rating': 5,
        'comment': 'Отличное заведение! Крафтовое пиво просто потрясающее, а ребра тают во рту. Обязательно вернусь!'
    }
)

Review.objects.get_or_create(
    user=user,
    menu_item=item2,
    defaults={
        'rating': 4,
        'comment': 'Уютная атмосфера, вкусная еда. Немного долго ждали заказ, но в целом очень доволен. Рекомендую!'
    }
)

print("Отзывы добавлены!")
