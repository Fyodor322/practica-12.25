from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views
from .simple_views import simple_login
from .export_views import export_bookings_excel, export_bookings_word, export_bookings_pdf, export_menu_excel
from .file_views import upload_file, list_files, delete_file

urlpatterns = [
    path('register/', csrf_exempt(views.register_user), name='register'),
    path('login/', simple_login, name='login'),
    path('logout/', csrf_exempt(views.logout_user), name='logout'),
    path('profile/', csrf_exempt(views.user_profile), name='user-profile'),
    path('reviews/', csrf_exempt(views.user_reviews), name='user-reviews'),
    path('menu/', csrf_exempt(views.menu_list), name='menu-list'),
    path('orders/', csrf_exempt(views.create_order), name='create-order'),
    
    # Экспорт
    path('export/bookings/excel/', export_bookings_excel, name='export-bookings-excel'),
    path('export/bookings/word/', export_bookings_word, name='export-bookings-word'),
    path('export/bookings/pdf/', export_bookings_pdf, name='export-bookings-pdf'),
    path('export/menu/excel/', export_menu_excel, name='export-menu-excel'),
    
    # Файлы
    path('files/upload/', upload_file, name='upload-file'),
    path('files/', list_files, name='list-files'),
    path('files/<int:file_id>/', delete_file, name='delete-file'),
]