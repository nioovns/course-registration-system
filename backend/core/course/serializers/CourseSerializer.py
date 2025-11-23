from rest_framework import serializers
from course.models.Course import Course
from course.models.ClassSession import ClassSession

from .ClassSessionSerializer import ClassSessionSerializer

class CourseSerializer(serializers.ModelSerializer):
    sessions = ClassSessionSerializer(many=True)
    prerequisites = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Course.objects.all(),
        required=False
    )

    class Meta:
        model = Course
        fields = ['id', 'name', 'code', 'capacity', 'sessions', 'prerequisites']

    def create(self, validated_data):
        sessions_data = validated_data.pop('sessions', [])
        prerequisites_data = validated_data.pop('prerequisites', [])
        course = Course.objects.create(**validated_data)

        for session_data in sessions_data:
            session = ClassSession.objects.create(**session_data)
            course.sessions.add(session)
        course.prerequisites.set(prerequisites_data)

        return course