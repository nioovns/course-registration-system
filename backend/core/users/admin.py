from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Student, Professor
from .forms import StudentCreationForm, ProfessorCreationForm

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'first_name', 'last_name', 'entry_year', 'get_username')
    search_fields = ('student_id', 'first_name', 'last_name')

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'

    def get_form(self, request, obj=None, **kwargs):
        if obj is None:
            kwargs['form'] = StudentCreationForm
        return super().get_form(request, obj, **kwargs)

    def get_exclude(self, request, obj=None):
        if obj is None:
            return ['user']
        return []

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ('professor_code', 'first_name', 'last_name', 'get_username')

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'

    def get_form(self, request, obj=None, **kwargs):
        if obj is None:
            kwargs['form'] = ProfessorCreationForm
        return super().get_form(request, obj, **kwargs)

    def get_exclude(self, request, obj=None):
        if obj is None:
            return ['user']
        return []

@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff')


    fieldsets = BaseUserAdmin.fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Role Info', {'fields': ('role',)}),
    )