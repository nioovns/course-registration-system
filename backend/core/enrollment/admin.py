from django.contrib import admin
from enrollment.models.EnrollmentSettings import EnrollmentSettings
from enrollment.models.models import Enrollment


@admin.register(EnrollmentSettings)
class EnrollmentSettingsAdmin(admin.ModelAdmin):
    list_display = ('min_units', 'max_units', 'is_active')

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')
    list_filter = ('enrolled_at',)
    search_fields = ('student__student_id', 'course__name', 'course__code')
    readonly_fields = ('enrolled_at',)