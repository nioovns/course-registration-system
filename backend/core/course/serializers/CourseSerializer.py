from rest_framework import serializers
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from .ClassSessionSerializer import ClassSessionSerializer
from users.models import User


class CourseSerializer(serializers.ModelSerializer):
    # 1. اصلاح فیلد sessions: استفاده از PrimaryKeyRelatedField برای دریافت آیدی
    sessions = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ClassSession.objects.all(),
        required=False
    )

    # 2. حذف تعریف تکراری prerequisites
    prerequisites = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Course.objects.all(),
        required=False
    )

    class Meta:
        model = Course
        fields = '__all__'

    # --- Validations (کدهای شما صحیح بودند و حفظ شدند) ---
    def validate_professor(self, value):
        # اضافه کردن شرط value برای جلوگیری از ارور در صورتی که فیلد خالی باشد
        if value and not value.role == User.Roles.PROFESSOR:
            raise serializers.ValidationError("The professor must have the role of 'Professor'.")
        return value

    def validate_code(self, value):
        qs = Course.objects.all()
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.filter(code=value).exists():
            raise serializers.ValidationError("Course code must be unique")
        return value

    def validate_capacity(self, value):
        if value < 0:
            raise serializers.ValidationError("Capacity must be greater than 0")
        return value

    # 3. حذف متدهای create و update دستی (DRF خودکار انجام می‌دهد)

    # 4. اضافه کردن to_representation برای نمایش اطلاعات کامل سشن‌ها در خروجی
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # نمایش جزئیات کامل سشن به جای فقط آیدی
        if instance.sessions.exists():
            representation['sessions'] = ClassSessionSerializer(instance.sessions.all(), many=True).data
        return representation