from rest_framework import serializers
from django.core.exceptions import ValidationError
from course.models.ClassSession import ClassSession
from course.validators import validate_time_range

class ClassSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSession
        fields = '__all__'
        
    def validate(self, data):
        try:
            validate_time_range(data['start_time'], data['end_time'])
        except ValidationError as e:
            raise serializers.ValidationError({
                'time_range': e.message
            })
        return data