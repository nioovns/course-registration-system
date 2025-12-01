from rest_framework import serializers
from course.models.Course import Course
from course.models.ClassSession import ClassSession
from .ClassSessionSerializer import ClassSessionSerializer
from users.models import User


class CourseSerializer(serializers.ModelSerializer):
    sessions = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=ClassSession.objects.all(),
        required=False
    )

    prerequisites = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Course.objects.all(),
        required=False
    )

    class Meta:
        model = Course
        fields = '__all__'

    def validate_professor(self, value):
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


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # نمایش جزئیات کامل سشن به جای فقط آیدی
        if instance.sessions.exists():
            representation['sessions'] = ClassSessionSerializer(instance.sessions.all(), many=True).data
        return representation