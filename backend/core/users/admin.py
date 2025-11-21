from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # ستون‌ها در لیست کاربران
    list_display = ('username', 'email', 'role', 'is_staff')

    # فیلتر کردن بر اساس نقش
    list_filter = ('role', 'is_staff')

    # اضافه کردن فیلد role به صفحه ویرایش کاربر
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات تکمیلی', {'fields': ('role', 'student_id', 'professor_code')}),
    )
