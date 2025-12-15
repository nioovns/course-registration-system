from django.contrib import admin
from enrollment.models.EnrollmentSettings import EnrollmentSettings

@admin.register(EnrollmentSettings)
class EnrollmentSettingsAdmin(admin.ModelAdmin):
    list_display = ('min_units', 'max_units', 'is_active')
