from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    # ستون‌های نمایش داده شده در لیست
    list_display = ('course_code', 'name', 'professor', 'capacity', 'schedule', 'location')

    # فیلد جستجو
    search_fields = ('name', 'course_code')

    # فیلترهای سمت راست
    list_filter = ('professor',)

    # رابط کاربری بهتر برای انتخاب پیش‌نیازها
    filter_horizontal = ('prerequisites',)