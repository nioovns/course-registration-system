from rest_framework import serializers
from enrollment.models import Enrollment
from course.models.Course import Course


class EnrollmentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    capacity = serializers.IntegerField(source='course.capacity', read_only=True)
    units = serializers.IntegerField(source='course.units', read_only=True)
    professor = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    prerequisites = serializers.SerializerMethodField()
    id = serializers.IntegerField(read_only=True)

    course = serializers.SlugRelatedField(
        slug_field='code',
        queryset=Course.objects.all(),
        write_only=True
    )

    class Meta:
        model = Enrollment
        fields = [
            'course_name',
            'course_code',
            'capacity',
            'units',
            'professor',
            'time',
            'location',
            'prerequisites',
            'id',
            'course',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def get_professor(self, obj):
        if obj.course.professor:
            return f"{obj.course.professor.first_name} {obj.course.professor.last_name}"
        return "نامشخص"

    def get_time(self, obj):
        sessions = obj.course.sessions.all()
        time_strings = []
        for session in sessions:
            day_name = session.get_day_display()
            start = session.start_time.strftime("%H:%M")
            end = session.end_time.strftime("%H:%M")
            time_strings.append(f"{day_name} {start}-{end}")

        return " | ".join(time_strings) if time_strings else "تعیین نشده"

    def get_location(self, obj):
        sessions = obj.course.sessions.all()
        locations = [session.room for session in sessions if session.room]
        unique_locations = list(set(locations))
        return " | ".join(unique_locations) if unique_locations else "تعیین نشده"

    def get_prerequisites(self, obj):
        prereqs = obj.course.prerequisites.all()
        if not prereqs:
            return "ندارد"
        return "، ".join([p.name for p in prereqs])