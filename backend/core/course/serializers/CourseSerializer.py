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

    def validate_code(self, value):
        if Course.objects.filter(code=value).exists():
            raise serializers.ValidationError("Course code must be unique")
        return value
    
    def validate_capacity(self, value):
        if value < 0:
            raise serializers.ValidationError("Capacity must be greater than 0")
        return value
    
    def create(self, validated_data): 
        sessions_data = validated_data.pop('sessions', [])
        prerequisites_data = validated_data.pop('prerequisites', [])
        course = Course.objects.create(**validated_data)

        for session_data in sessions_data:
            session = ClassSession.objects.create(**session_data)
            course.sessions.add(session)
        course.prerequisites.set(prerequisites_data)

        return course