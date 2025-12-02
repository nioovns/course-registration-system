from rest_framework import serializers
from .ClassSessionSerializer import ClassSessionSerializer
from users.models import User
from course.models.Course import Course
from course.models.ClassSession import ClassSession

class CourseSerializer(serializers.ModelSerializer):
    sessions = ClassSessionSerializer(many=True, required=False)
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


    def create(self, validated_data):
        sessions_data = validated_data.pop('sessions', [])
        course = Course.objects.create(**validated_data)

        for session_data in sessions_data:
            exists = ClassSession.objects.filter(
                day=session_data['day'],
                start_time=session_data['start_time'],
                end_time=session_data['end_time'],
                faculty=session_data['faculty'],
                room=session_data['room']
            ).exists()

            if exists:
                raise serializers.ValidationError(
                    f"A session with the same time, day, faculty and room already exists."
                )
                
            obj = ClassSession.objects.create(**session_data)
            course.sessions.add(obj)

        return course

    def update(self, instance, validated_data):
        sessions_data = validated_data.pop('sessions', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if sessions_data is not None:
            for session_data in sessions_data:
                exists = ClassSession.objects.filter(
                    day=session_data['day'],
                    start_time=session_data['start_time'],
                    end_time=session_data['end_time'],
                    faculty=session_data['faculty'],
                    room=session_data['room']
                ).exclude(courses=instance).exists()  
                if exists:
                    raise serializers.ValidationError(
                        f"A session with the same time, day, faculty and room already exists."
                    )

            instance.sessions.clear()
            for session_data in sessions_data:
                obj = ClassSession.objects.create(**session_data)
                instance.sessions.add(obj)

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sessions'] = ClassSessionSerializer(
            instance.sessions.all(), many=True
        ).data
        return representation