from django.contrib import admin
from .models.ClassSession import ClassSession
from .models.Course import Course

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'unit', 'capacity', 'professor')

@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ('day', 'start_time', 'end_time', 'faculty', 'room')
