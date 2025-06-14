from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets, serializers
from .models import Student, Professor, Course, Payment, Instrument, Observation
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db.models import Count
from datetime import timedelta
import os
import json

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = '__all__'

class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = '__all__'

@csrf_exempt
@api_view(['GET', 'POST'])
def students_list(request):
    if request.method == 'GET':
        students = Student.objects.all()
        return Response(StudentSerializer(students, many=True).data)
    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request, pk):
    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(StudentSerializer(student).data)
    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['GET', 'POST'])
def professors_list(request):
    if request.method == 'GET':
        professors = Professor.objects.all()
        return Response(ProfessorSerializer(professors, many=True).data)
    elif request.method == 'POST':
        serializer = ProfessorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def professor_detail(request, pk):
    try:
        professor = Professor.objects.get(pk=pk)
    except Professor.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(ProfessorSerializer(professor).data)
    elif request.method == 'PUT':
        serializer = ProfessorSerializer(professor, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        professor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['GET', 'POST'])
def courses_list(request):
    if request.method == 'GET':
        courses = Course.objects.all()
        return Response(CourseSerializer(courses, many=True).data)
    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(CourseSerializer(course).data)
    elif request.method == 'PUT':
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['GET', 'POST'])
def payments_list(request):
    if request.method == 'GET':
        payments = Payment.objects.all()
        return Response(PaymentSerializer(payments, many=True).data)
    elif request.method == 'POST':
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def payment_detail(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
    except Payment.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(PaymentSerializer(payment).data)
    elif request.method == 'PUT':
        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['GET', 'POST'])
def instruments_list(request):
    if request.method == 'GET':
        instruments = Instrument.objects.all()
        return Response(InstrumentSerializer(instruments, many=True).data)
    elif request.method == 'POST':
        serializer = InstrumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'POST'])
def observations_list(request):
    if request.method == 'GET':
        student_id = request.GET.get('student')
        course_id = request.GET.get('course')
        professor_id = request.GET.get('professor')
        qs = Observation.objects.all()
        if student_id:
            qs = qs.filter(student_id=student_id)
        if course_id:
            qs = qs.filter(course_id=course_id)
        if professor_id:
            qs = qs.filter(professor_id=professor_id)
        return Response(ObservationSerializer(qs, many=True).data)
    elif request.method == 'POST':
        serializer = ObservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def observation_detail(request, pk):
    try:
        obs = Observation.objects.get(pk=pk)
    except Observation.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        return Response(ObservationSerializer(obs).data)
    elif request.method == 'PUT':
        serializer = ObservationSerializer(obs, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        obs.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def hello_world(request):
    return Response({"message": "¡Hola desde el backend Django!"})

@api_view(['GET'])
def root_welcome(request):
    return HttpResponse("<h2>Bienvenido al backend de Xestión Conservatorio</h2><p>API disponible en <a href='/api/'>/api/</a></p>")

@api_view(['GET'])
def student_by_user(request, user_id):
    try:
        student = Student.objects.get(user_id=user_id)
        return Response(StudentSerializer(student).data)
    except Student.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

# --- IA Administrativa: Análisis de matrículas ---
@api_view(['GET'])
def ia_enrollment_analysis(request):
    # Asignaturas más elegidas (por nombre de curso)
    top_courses = (
        Course.objects
        .annotate(num_enrollments=Count('enrollment'))
        .order_by('-num_enrollments')[:5]
    )
    top_courses_data = [
        {
            'course_id': c.id,
            'name': c.name,
            'num_enrollments': c.num_enrollments
        } for c in top_courses
    ]

    # Horarios saturados: contar cuántos cursos hay por franja horaria (start_date, end_date, room)
    # Para simplificar, agrupamos por room y start_date
    from collections import Counter
    schedule_counter = Counter()
    for course in Course.objects.exclude(room__isnull=True).exclude(start_date__isnull=True):
        key = f"{course.room} - {course.start_date}"
        schedule_counter[key] += 1
    saturated_schedules = [
        {'room': k.split(' - ')[0], 'date': k.split(' - ')[1], 'count': v}
        for k, v in schedule_counter.items() if v > 1
    ]

    return Response({
        'top_courses': top_courses_data,
        'saturated_schedules': saturated_schedules
    })

# --- IA Administrativa: Optimización de horarios ---
@api_view(['GET'])
def ia_schedule_optimization(request):
    # Obtener todos los cursos con sala y horario definidos
    courses = Course.objects.exclude(room__isnull=True).exclude(start_date__isnull=True).exclude(end_date__isnull=True)
    # Agrupar por aula
    room_schedules = {}
    for c in courses:
        key = c.room
        if key not in room_schedules:
            room_schedules[key] = []
        room_schedules[key].append({
            'course_id': c.id,
            'name': c.name,
            'start_date': c.start_date,
            'end_date': c.end_date
        })
    # Detectar solapamientos y sugerir combinaciones
    optimizations = []
    for room, scheds in room_schedules.items():
        # Ordenar por fecha de inicio
        scheds_sorted = sorted(scheds, key=lambda x: x['start_date'])
        for i in range(len(scheds_sorted)-1):
            current = scheds_sorted[i]
            next_ = scheds_sorted[i+1]
            # Si el fin del actual es posterior al inicio del siguiente, hay solapamiento
            if current['end_date'] >= next_['start_date']:
                optimizations.append({
                    'room': room,
                    'courses': [current['name'], next_['name']],
                    'suggestion': f"Separar '{current['name']}' y '{next_['name']}' en el aula {room} para evitar solapamiento."
                })
    return Response({'optimizations': optimizations})

# --- IA Administrativa: Predicción de demanda por curso ---
from datetime import datetime

@api_view(['GET'])
def ia_demand_prediction(request):
    # Obtener todas las matrículas y cursos
    enrollments = []
    for c in Course.objects.all():
        # Contar matrículas por año para este curso
        years = {}
        for s in c.student_set.all():
            year = s.enrollment_date.year if s.enrollment_date else None
            if year:
                years[year] = years.get(year, 0) + 1
        # Ordenar años y calcular tendencia simple (diferencia entre últimos dos años)
        sorted_years = sorted(years.items())
        trend = 0
        if len(sorted_years) >= 2:
            trend = sorted_years[-1][1] - sorted_years[-2][1]
        prediction = sorted_years[-1][1] + trend if sorted_years else 0
        enrollments.append({
            'course_id': c.id,
            'name': c.name,
            'last_year': sorted_years[-1][0] if sorted_years else None,
            'last_year_enrollments': sorted_years[-1][1] if sorted_years else 0,
            'predicted_next_year': prediction
        })
    return Response({'predictions': enrollments})

# --- IA Asistente automático para profesores (FAQ) ---
@api_view(['POST'])
def ia_professor_faq(request):
    question = request.data.get('question', '').lower()
    # Respuestas simuladas
    faqs = {
        'cómo subo un recurso': 'Para subir un recurso, accede a la sección "Recursos" y haz clic en "Añadir nuevo recurso".',
        'cómo registrar asistencia': 'Ve a la sección de asistencia, selecciona el curso y marca la presencia de los alumnos.',
        'cómo contactar con administración': 'Puedes enviar un mensaje desde la sección "Comunicación" o escribir a admin@conservatorio.edu.',
        'cómo ver mi horario': 'Tu horario está disponible en la sección "Horario Profesor" del menú lateral.',
        'cómo añadir observaciones': 'En la página de estudiantes asignados, haz clic en el alumno y selecciona "Añadir observación".'
    }
    for k, v in faqs.items():
        if k in question:
            return Response({'answer': v})
    return Response({'answer': 'No se encontró una respuesta automática. Por favor, contacta con administración.'})

# --- IA Revisión de documentación (simulada) ---
from rest_framework.parsers import MultiPartParser
from django.core.files.uploadedfile import UploadedFile

@api_view(['POST'])
def ia_document_review(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'result': 'No se recibió ningún archivo.'}, status=400)
    # Simulación: validación por extensión y tamaño
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ['.pdf', '.jpg', '.jpeg', '.png']:
        return Response({'result': 'Formato no válido. Solo se aceptan PDF o imagen.'})
    if file.size > 2 * 1024 * 1024:
        return Response({'result': 'El archivo supera el tamaño máximo permitido (2MB).'})
    # Simulación de validación de firma
    if 'firma' in file.name.lower():
        return Response({'result': 'Documento válido y firmado correctamente.'})
    return Response({'result': 'Documento recibido. No se detectó firma digital.'})

# --- IA Generador de informes automáticos (simulado) ---
from datetime import date

@api_view(['GET'])
def ia_generate_report(request):
    # Simulación de informe mensual
    today = date.today()
    month = today.month
    year = today.year
    # Datos simulados
    report = {
        'month': month,
        'year': year,
        'new_enrollments': 12,
        'total_attendance': 95,  # %
        'incidents': 2,
        'payments_processed': 18,
        'documents_reviewed': 7,
        'notes': 'Actividad estable. Sin incidencias graves. Buen nivel de asistencia.'
    }
    return Response({'report': report})

# --- IA Sugerencias de recursos didácticos personalizados (simulado) ---
@api_view(['POST'])
def ia_resources_suggestions(request):
    # Recibe: nivel, instrumento, tema, etc.
    level = request.data.get('level', '').lower()
    instrument = request.data.get('instrument', '').lower()
    topic = request.data.get('topic', '').lower()
    # Sugerencias simuladas
    suggestions = []
    if 'piano' in instrument:
        suggestions.append('Método Bastien para Piano - Nivel 1 (PDF)')
        suggestions.append('Video: Postura correcta en el piano')
    if 'teoría' in topic or 'teoria' in topic:
        suggestions.append('Guía de iniciación a la teoría musical (PDF)')
    if 'motivación' in topic or 'motivacion' in topic:
        suggestions.append('Artículo: Estrategias para motivar al alumnado')
    if not suggestions:
        suggestions.append('No se encontraron sugerencias específicas. Prueba con otro tema o instrumento.')
    return Response({'suggestions': suggestions})

# --- IA Generación automática de mensajes a familias (simulado) ---
@api_view(['POST'])
def ia_generate_family_message(request):
    motivo = request.data.get('motivo', '').lower()
    alumno = request.data.get('alumno', 'el alumno/a')
    if 'ausencia' in motivo:
        mensaje = f"Estimadas familias, les informamos que {alumno} ha estado ausente en la última clase. Por favor, contacten con el centro si necesitan aclaraciones."
    elif 'felicitación' in motivo or 'felicitacion' in motivo:
        mensaje = f"¡Enhorabuena! {alumno} ha mostrado un progreso destacado. Les animamos a seguir apoyando su aprendizaje."
    elif 'reunión' in motivo or 'reunion' in motivo:
        mensaje = f"Les recordamos la próxima reunión de tutores. Su asistencia es importante para el seguimiento académico de {alumno}."
    else:
        mensaje = f"Mensaje automático generado para {alumno} por el motivo: {motivo}."
    return Response({'mensaje': mensaje})

import json
CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'config_ia.json')

@csrf_exempt
@api_view(['GET', 'POST'])
def config_ia_enabled(request):
    # Lee o escribe el estado global de la IA administrativa
    if request.method == 'GET':
        try:
            with open(CONFIG_PATH, 'r') as f:
                data = json.load(f)
            ia_enabled = data.get('ia_enabled', True)
        except Exception:
            ia_enabled = True
        return Response({'ia_enabled': ia_enabled})
    elif request.method == 'POST':
        try:
            ia_enabled = request.data.get('ia_enabled', True)
            with open(CONFIG_PATH, 'w') as f:
                json.dump({'ia_enabled': ia_enabled}, f)
            return Response({'ia_enabled': ia_enabled})
        except Exception as e:
            return Response({'error': str(e)}, status=400)
