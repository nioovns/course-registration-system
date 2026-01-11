from rest_framework import serializers
from django.core.exceptions import ValidationError
from course.models.ClassSession import ClassSession
from course.validators import validate_time_range

class ClassSessionSerializer(serializers.ModelSerializer):
    faculty_display = serializers.CharField(source='get_faculty_display', read_only=True)
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    
    class Meta:
        model = ClassSession
        fields = [
            "id",
            "day",
            "day_display",
            "start_time",
            "end_time",
            "faculty",
            "faculty_display",
            "room"
        ]
        
    def validate(self, data):
        try:
            validate_time_range(data['start_time'], data['end_time'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'time_range': e.message
            })
        return data