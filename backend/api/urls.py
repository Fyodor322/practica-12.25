from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views
from .simple_views import simple_login

urlpatterns = [
    path('register/', csrf_exempt(views.register_user), name='register'),
    path('login/', simple_login, name='login'),
    path('logout/', csrf_exempt(views.logout_user), name='logout'),
    path('profile/', csrf_exempt(views.user_profile), name='user-profile'),
]