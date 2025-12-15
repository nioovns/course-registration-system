from django.contrib import admin
from course.models.Course import Course
from course.models.ClassSession import ClassSession

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'units', 'capacity', 'professor', 'prerequisites_list', 'sessions_list')
    search_fields = ('name', 'code')
    list_filter = ('units',)

    def prerequisites_list(self, obj):
        return ", ".join([p.name for p in obj.prerequisites.all()])
    prerequisites_list.short_description = 'Prerequisites'

    def sessions_list(self, obj):
        return ", ".join([f"{s.day} {s.start_time}-{s.end_time}" for s in obj.sessions.all()])
    sessions_list.short_description = 'Sessions'

@admin.register(ClassSession)
class ClassSessionAdmin(admin.ModelAdmin):
    list_display = ('day', 'start_time', 'end_time', 'room')