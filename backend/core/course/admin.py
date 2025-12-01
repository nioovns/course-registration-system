from django.contrib import admin
from .models import Course, ClassSession

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    # تغییر unit به units
    list_display = ('name', 'code', 'units', 'capacity', 'professor')
    search_fields = ('name', 'code')
    list_filter = ('units',) #

@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ('day', 'start_time', 'end_time', 'room')