from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from course.models import Course
from enrollment.models import Enrollment
from enrollment.services import enroll_student


class EnrollmentSerializer(serializers.ModelSerializer):
    course = serializers.SlugRelatedField(
        slug_field='code',
        queryset=Course.objects.all(),
        write_only=True
    )
    course_title = serializers.CharField(source='course.title',
                                         read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    professor_name = serializers.SerializerMethodField()
    class_schedule = serializers.StringRelatedField(source='course.sessions', many=True, read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id',
            'course',
            'course_title',
            'course_code',
            'professor_name',
            'class_schedule',
            'status',
            'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'course_title', 'course_code']

    def get_professor_name(self, obj):
        if obj.course.professor:
            return f"{obj.course.professor.first_name} {obj.course.professor.last_name}"
        return "نامشخص"

    def create(self, validated_data):
        user = self.context['request'].user


        if not hasattr(user, 'student'):
            raise serializers.ValidationError(_("فقط دانشجویان می‌توانند انتخاب واحد کنند."))

        student = user.student
        course = validated_data['course']

        try:
            return enroll_student(student, course)

        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        except Exception as e:
            raise serializers.ValidationError(str(e))