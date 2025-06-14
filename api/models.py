from django.db import models

# Create your models here.
class Student(models.Model):
    user_id = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    date_of_birth = models.DateField()
    instrument_id = models.CharField(max_length=100)
    enrollment_date = models.DateField()
    address = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)

class Professor(models.Model):
    user_id = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    specialty = models.CharField(max_length=255)
    hire_date = models.DateField()
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    tutoring_schedule = models.CharField(max_length=255, blank=True, null=True)  # Nuevo campo
    classrooms = models.CharField(max_length=255, blank=True, null=True)  # Nuevo campo, puede ser lista separada por comas

class Course(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    level = models.CharField(max_length=50)
    teacher = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    room = models.CharField(max_length=100, blank=True, null=True)

class Payment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    amount = models.FloatField()
    payment_date = models.DateField(blank=True, null=True)
    due_date = models.DateField()
    status = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    invoice_url = models.CharField(max_length=255, blank=True, null=True)

class Instrument(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)

class Observation(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    professor = models.ForeignKey(Professor, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    text = models.TextField()
    # Opcional: tipo, adjuntos, etc.

class Enrollment(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    enrollment_date = models.DateField()
    status = models.CharField(max_length=50, default='Active')

    def __str__(self):
        return f"{self.student.first_name} {self.student.last_name} - {self.course.name} ({self.status})"
