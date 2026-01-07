from django.contrib import admin
from enrollment.models.Enrollment import Enrollment
from enrollment.models.EnrollmentSettings import EnrollmentSettings


@admin.register(EnrollmentSettings)
class EnrollmentSettingsAdmin(admin.ModelAdmin):
    list_display = ('min_units', 'max_units', 'is_active')
    list_editable = ('is_active',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'status', 'grade', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('student__student_id', 'course__name', 'course__code')
    readonly_fields = ('created_at',)
    list_per_page = 20