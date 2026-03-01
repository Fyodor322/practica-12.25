from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from .models import Booking, Order, MenuItem
import io

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_bookings_excel(request):
    """Экспорт бронирований в Excel"""
    bookings = Booking.objects.filter(user=request.user).select_related('table__restaurant')
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Бронирования"
    
    # Заголовки
    headers = ['ID', 'Ресторан', 'Столик', 'Дата', 'Время', 'Гостей', 'Статус']
    ws.append(headers)
    
    # Стилизация заголовков
    header_fill = PatternFill(start_color="E7DC00", end_color="E7DC00", fill_type="solid")
    header_font = Font(bold=True, size=12)
    
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center')
    
    # Данные
    for booking in bookings:
        ws.append([
            booking.id,
            booking.table.restaurant.name,
            f"Столик {booking.table.number}",
            booking.date.strftime('%d.%m.%Y'),
            booking.time.strftime('%H:%M'),
            booking.guests,
            booking.get_status_display()
        ])
    
    # Автоширина колонок
    for column in ws.columns:
        max_length = 0
        column = [cell for cell in column]
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(cell.value)
            except:
                pass
        adjusted_width = (max_length + 2)
        ws.column_dimensions[column[0].column_letter].width = adjusted_width
    
    # Сохранение
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    response = HttpResponse(
        output.read(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename=bookings.xlsx'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_bookings_word(request):
    """Экспорт бронирований в Word"""
    bookings = Booking.objects.filter(user=request.user).select_related('table__restaurant')
    
    doc = Document()
    
    # Заголовок
    title = doc.add_heading('Мои бронирования', 0)
    title.alignment = 1  # Центр
    
    # Информация о пользователе
    doc.add_paragraph(f'Пользователь: {request.user.get_full_name() or request.user.username}')
    doc.add_paragraph(f'Email: {request.user.email}')
    doc.add_paragraph('')
    
    # Таблица
    table = doc.add_table(rows=1, cols=7)
    table.style = 'Light Grid Accent 1'
    
    # Заголовки
    headers = ['ID', 'Ресторан', 'Столик', 'Дата', 'Время', 'Гостей', 'Статус']
    header_cells = table.rows[0].cells
    for i, header in enumerate(headers):
        header_cells[i].text = header
        for paragraph in header_cells[i].paragraphs:
            for run in paragraph.runs:
                run.font.bold = True
    
    # Данные
    for booking in bookings:
        row_cells = table.add_row().cells
        row_cells[0].text = str(booking.id)
        row_cells[1].text = booking.table.restaurant.name
        row_cells[2].text = f"Столик {booking.table.number}"
        row_cells[3].text = booking.date.strftime('%d.%m.%Y')
        row_cells[4].text = booking.time.strftime('%H:%M')
        row_cells[5].text = str(booking.guests)
        row_cells[6].text = booking.get_status_display()
    
    # Сохранение
    output = io.BytesIO()
    doc.save(output)
    output.seek(0)
    
    response = HttpResponse(
        output.read(),
        content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    response['Content-Disposition'] = 'attachment; filename=bookings.docx'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_bookings_pdf(request):
    """Экспорт бронирований в PDF"""
    bookings = Booking.objects.filter(user=request.user).select_related('table__restaurant')
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#E7DC00'),
        spaceAfter=30,
        alignment=1
    )
    
    # Заголовок
    elements.append(Paragraph('Мои бронирования', title_style))
    elements.append(Spacer(1, 12))
    
    # Информация о пользователе
    user_info = f"Пользователь: {request.user.get_full_name() or request.user.username}<br/>Email: {request.user.email}"
    elements.append(Paragraph(user_info, styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Таблица
    data = [['ID', 'Ресторан', 'Столик', 'Дата', 'Время', 'Гостей', 'Статус']]
    
    for booking in bookings:
        data.append([
            str(booking.id),
            booking.table.restaurant.name,
            f"№{booking.table.number}",
            booking.date.strftime('%d.%m.%Y'),
            booking.time.strftime('%H:%M'),
            str(booking.guests),
            booking.get_status_display()
        ])
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E7DC00')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    
    doc.build(elements)
    buffer.seek(0)
    
    response = HttpResponse(buffer.read(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=bookings.pdf'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_menu_excel(request):
    """Экспорт меню в Excel"""
    menu_items = MenuItem.objects.select_related('category').filter(is_available=True)
    
    wb = Workbook()
    ws = wb.active
    ws.title = "Меню"
    
    headers = ['Название', 'Категория', 'Описание', 'Цена']
    ws.append(headers)
    
    header_fill = PatternFill(start_color="E7DC00", end_color="E7DC00", fill_type="solid")
    for cell in ws[1]:
        cell.fill = header_fill
        cell.font = Font(bold=True)
    
    for item in menu_items:
        ws.append([item.name, item.category.name, item.description, float(item.price)])
    
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    
    response = HttpResponse(output.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=menu.xlsx'
    return response