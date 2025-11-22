from rest_framework import serializers
from models.ClassSession import ClassSession

class ClassSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSession
        fields = '__all__'