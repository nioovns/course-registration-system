from django.contrib import admin
from course.models.Course import Course
from course.models.ClassSession import ClassSession

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    # تغییر unit به units
    list_display = ('name', 'code', 'unit', 'capacity', 'professor')
    search_fields = ('name', 'code')
    list_filter = ('unit',) #

@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ('day', 'start_time', 'end_time', 'room')