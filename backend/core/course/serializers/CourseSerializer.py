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
    professor = serializers.CharField(required=False)

    class Meta:
        model = Course
        fields = '__all__'

    def validate_professor(self, value):
        if not value:
            return getattr(self.instance, 'professor', None)
        
        name = value.strip()
        try:
            user = User.objects.get(username=name)
        except User.DoesNotExist:
            raise serializers.ValidationError("No professor found with this name.")
        if user.role != User.Roles.PROFESSOR:
            raise serializers.ValidationError("The professor must have the role of 'Professor'.")
        return user
    
    def validate_code(self, value):
        qs = Course.objects.all()
        if self.instance:
            qs = qs.exclude(id=self.instance.id)
        if qs.filter(code=value).exists():
            raise serializers.ValidationError("Course code must be unique")
        return value

    def validate_capacity(self, value):
        if value < 0:
            raise serializers.ValidationError("Ensure this value is greater than or equal to 0.")
        return value

    def validate(self, attrs):
        sessions_data = attrs.get('sessions', None)
        units = attrs.get('units', getattr(self.instance, 'units', 0))

        if sessions_data is not None:
            self.validate_units_vs_sessions(units, sessions_data)
            for session_data in sessions_data:
                exists = ClassSession.objects.filter(
                    day=session_data['day'],
                    start_time=session_data['start_time'],
                    end_time=session_data['end_time'],
                    faculty=session_data['faculty'],
                    room=session_data['room']
                )
                if self.instance:
                    exists = exists.exclude(courses=self.instance)
                if exists.exists():
                    raise serializers.ValidationError(
                        f"A session with the same time, day, faculty and room already exists."
                    )

        return attrs

    def create(self, validated_data):
        sessions_data = validated_data.pop('sessions', [])
        prerequisites_data = validated_data.pop('prerequisites', [])  
        course = Course.objects.create(**validated_data)
        for session_data in sessions_data:
            obj = ClassSession.objects.create(**session_data)
            course.sessions.add(obj)

        if prerequisites_data:
            course.prerequisites.set(prerequisites_data)

        return course

    def update(self, instance, validated_data):
        sessions_data = validated_data.pop('sessions', None)
        prerequisites_data = validated_data.pop('prerequisites', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if sessions_data is not None:
            instance.sessions.clear()
            for session_data in sessions_data:
                obj = ClassSession.objects.create(**session_data)
                instance.sessions.add(obj)

        if prerequisites_data is not None:
            instance.prerequisites.set(prerequisites_data)

        return instance

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sessions'] = ClassSessionSerializer(
            instance.sessions.all(), many=True
        ).data
        return representation
    
    def validate_units_vs_sessions(self, units, sessions_data):
        if units >= 3 and len(sessions_data) != 2:
            raise serializers.ValidationError(
                "Courses with 3 or more units must have exactly 2 sessions."
            )
        elif units < 3 and len(sessions_data) != 1:
            raise serializers.ValidationError(
                "Courses with 2 or fewer units must have exactly 1 session."
            )
