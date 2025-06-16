from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, AttendanceViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', views.root_welcome, name='root_welcome'),
    path('hello/', views.hello_world, name='hello_world'),
    path('students/', views.students_list, name='students_list'),
    path('students/<int:pk>/', views.student_detail, name='student_detail'),
    path('students/by_user/<str:user_id>/', views.student_by_user, name='student_by_user'),
    path('professors/', views.professors_list, name='professors_list'),
    path('professors/<int:pk>/', views.professor_detail, name='professor_detail'),
    path('courses/', views.courses_list, name='courses_list'),
    path('courses/<int:pk>/', views.course_detail, name='course_detail'),
    path('payments/', views.payments_list, name='payments_list'),
    path('payments/<int:pk>/', views.payment_detail, name='payment_detail'),
    path('instruments/', views.instruments_list, name='instruments_list'),
    path('observations/', views.observations_list, name='observations_list'),
    path('observations/<int:pk>/', views.observation_detail, name='observation_detail'),
    path('ia/enrollment-analysis/', views.ia_enrollment_analysis, name='ia_enrollment_analysis'),
    path('ia/schedule-optimization/', views.ia_schedule_optimization, name='ia_schedule_optimization'),
    path('ia/demand-prediction/', views.ia_demand_prediction, name='ia_demand_prediction'),
    path('ia/professor-faq/', views.ia_professor_faq, name='ia_professor_faq'),
    path('ia/document-review/', views.ia_document_review, name='ia_document_review'),
    path('ia/generate-report/', views.ia_generate_report, name='ia_generate_report'),
    path('ia/resources-suggestions/', views.ia_resources_suggestions, name='ia_resources_suggestions'),
    path('ia/generate-family-message/', views.ia_generate_family_message, name='ia_generate_family_message'),
    path('config/ia_enabled/', views.config_ia_enabled, name='config_ia_enabled'),
    path('enrollments/', views.enrollments_list, name='enrollments_list'),
    path('enrollments/<int:pk>/', views.enrollment_detail, name='enrollment_detail'),
]

urlpatterns += router.urls
