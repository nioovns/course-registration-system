from rest_framework import serializers
from django.core.exceptions import ValidationError
from ..models.Enrollment import Enrollment
from course.models.Course import Course
from course.serializers.CourseSerializer import CourseSerializer
from ..services import enroll_student


class EnrollmentSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(write_only=True)
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'course_id', 'course_details', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        if not hasattr(user, 'student'):
            raise serializers.ValidationError("فقط دانشجویان می‌توانند انتخاب واحد کنند.")

        student = user.student
        course_id = validated_data['course_id']

        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            raise serializers.ValidationError("درس مورد نظر یافت نشد.")

        try:
            enrollment = enroll_student(student, course)
            return enrollment
        except ValidationError as e:
            raise serializers.ValidationError({"error": e.messages if hasattr(e, 'messages') else str(e)})