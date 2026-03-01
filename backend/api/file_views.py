from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.files.uploadedfile import UploadedFile
from .models import FileUpload
from .serializers_full import FileUploadSerializer
import magic
import os

# Разрешенные MIME типы
ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]

# Максимальный размер файла (10 MB)
MAX_FILE_SIZE = 10 * 1024 * 1024

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    """
    Загрузка файла с валидацией:
    - Проверка MIME-типа
    - Ограничение размера
    - Извлечение метаданных
    """
    if 'file' not in request.FILES:
        return Response(
            {'error': 'Файл не предоставлен'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    uploaded_file = request.FILES['file']
    
    # Проверка размера файла
    if uploaded_file.size > MAX_FILE_SIZE:
        return Response(
            {'error': f'Размер файла превышает {MAX_FILE_SIZE / (1024*1024)} MB'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Проверка MIME-типа
    try:
        mime = magic.Magic(mime=True)
        file_mime_type = mime.from_buffer(uploaded_file.read(1024))
        uploaded_file.seek(0)  # Возвращаем указатель в начало
        
        if file_mime_type not in ALLOWED_MIME_TYPES:
            return Response(
                {'error': f'Тип файла {file_mime_type} не разрешен'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(
            {'error': f'Ошибка проверки типа файла: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Извлечение метаданных
    original_name = uploaded_file.name
    file_size = uploaded_file.size
    
    # Сохранение файла
    try:
        file_upload = FileUpload.objects.create(
            user=request.user,
            file=uploaded_file,
            original_name=original_name,
            file_size=file_size,
            mime_type=file_mime_type,
            description=request.data.get('description', '')
        )
        
        serializer = FileUploadSerializer(file_upload)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'error': f'Ошибка сохранения файла: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_files(request):
    """Список загруженных файлов пользователя"""
    files = FileUpload.objects.filter(user=request.user).order_by('-created_at')
    serializer = FileUploadSerializer(files, many=True)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    """Удаление файла"""
    try:
        file_upload = FileUpload.objects.get(id=file_id, user=request.user)
        
        # Удаляем физический файл
        if file_upload.file:
            if os.path.isfile(file_upload.file.path):
                os.remove(file_upload.file.path)
        
        # Удаляем запись из БД
        file_upload.delete()
        
        return Response(
            {'message': 'Файл успешно удален'},
            status=status.HTTP_200_OK
        )
    except FileUpload.DoesNotExist:
        return Response(
            {'error': 'Файл не найден'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Ошибка удаления файла: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )