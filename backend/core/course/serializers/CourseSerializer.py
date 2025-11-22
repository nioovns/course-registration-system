from rest_framework import serializers
from models.Course import Course
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
