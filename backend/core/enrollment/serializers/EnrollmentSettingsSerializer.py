from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from course.models import Course
from enrollment.models import EnrollmentSettings
from enrollment.models.models import Enrollment


class EnrollmentSettingsSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(default=True)

    class Meta:
        model = EnrollmentSettings
        fields = "__all__"

    def validate(self, attrs):
        min_units = attrs.get("min_units")
        max_units = attrs.get("max_units")

        if min_units is not None and max_units is not None:
            if min_units >= max_units:
                raise serializers.ValidationError(
                    "حداقل واحد باید کمتر از حداکثر واحد باشد"
                )

        return attrs



class EnrollmentSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(write_only=True)

    course_name = serializers.CharField(source='course.name', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    professor_name = serializers.CharField(source='course.professor.last_name', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'course_id', 'course_name', 'course_code', 'professor_name', 'enrolled_at']
        read_only_fields = ['id', 'enrolled_at']

    def validate(self, attrs):
        request = self.context.get('request')
        student = request.user.student
        course_id = attrs.get('course_id')

        try:
            course_obj = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise serializers.ValidationError(_("درس مورد نظر یافت نشد."))

        if Enrollment.objects.filter(student=student, course=course_obj).exists():
            raise serializers.ValidationError(_("شما قبلاً این درس را اخذ کرده‌اید."))

        if course_obj.is_full:
            raise serializers.ValidationError(_("ظرفیت این درس تکمیل شده است."))

        self.check_time_conflict(student, course_obj)

        attrs['course'] = course_obj
        return attrs

    def check_time_conflict(self, student, new_course):
        new_sessions = new_course.sessions.all()
        current_enrollments = Enrollment.objects.filter(student=student)

        for enrollment in current_enrollments:
            existing_course = enrollment.course
            existing_sessions = existing_course.sessions.all()

            for new_sess in new_sessions:
                for exist_sess in existing_sessions:
                    if new_sess.day == exist_sess.day:
                        if (new_sess.start_time < exist_sess.end_time) and \
                                (exist_sess.start_time < new_sess.end_time):
                            raise serializers.ValidationError(
                                _(f"تداخل زمانی: درس '{new_course.name}' با درس '{existing_course.name}' در روز {new_sess.get_day_display()} تداخل دارد.")
                            )

    def create(self, validated_data):
        validated_data.pop('course_id')
        student = self.context['request'].user.student
        course = validated_data['course']

        return Enrollment.objects.create(student=student, course=course)