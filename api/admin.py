from django.contrib import admin
from .models import Student, Instrument, Professor, Course, Enrollment

admin.site.register(Student)
admin.site.register(Instrument)
admin.site.register(Professor)
admin.site.register(Course)
admin.site.register(Enrollment)
