from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')

    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'student_id', 'professor_code')

    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات تکمیلی دانشگاه', {
            'fields': ('role', 'student_id', 'professor_code', 'first_name', 'last_name'),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('اطلاعات تکمیلی دانشگاه', {
            'fields': ('role', 'student_id', 'professor_code','first_name', 'last_name'),
        }),
    )
