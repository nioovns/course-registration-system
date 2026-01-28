from rest_framework import serializers
from django.db import transaction
from django.db.models import F
from enrollment.models import Enrollment
from enrollment.models.EnrollmentSettings import EnrollmentSettings
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
        location_strings = []
        for session in sessions:
            if session.room:
                faculty_name = session.get_faculty_display()
                location_strings.append(f"{faculty_name} {session.room}")

        unique_locations = list(set(location_strings))
        return " | ".join(unique_locations) if unique_locations else "تعیین نشده"

    def get_prerequisites(self, obj):
        prereqs = obj.course.prerequisites.all()
        if not prereqs:
            return "ندارد"
        return "، ".join([p.name for p in prereqs])

    def validate(self, attrs):
        request = self.context.get('request')
        student = request.user.student
        new_course = attrs['course']

        if Enrollment.objects.filter(
                student=student,
                course=new_course,
                status__in=['enrolled', 'passed']
        ).exists():
            raise serializers.ValidationError("شما قبلاً این درس را اخذ کرده یا پاس نموده‌اید.")

        if new_course.capacity <= 0:
            raise serializers.ValidationError("ظرفیت این درس تکمیل شده است.")

        passed_courses_ids = Enrollment.objects.filter(
            student=student,
            status='passed'
        ).values_list('course_id', flat=True)

        prerequisites = new_course.prerequisites.all()
        missing_prereqs = []
        for prereq in prerequisites:
            if prereq.id not in passed_courses_ids:
                missing_prereqs.append(prereq.name)

        if missing_prereqs:
            raise serializers.ValidationError(
                f"پیش‌نیازهای زیر رعایت نشده‌اند: {', '.join(missing_prereqs)}"
            )

        settings = EnrollmentSettings.objects.first()
        max_allowed_units = settings.max_units if settings else 20

        current_units = sum(
            e.course.units for e in Enrollment.objects.filter(student=student, status='enrolled')
        )
        if current_units + new_course.units > max_allowed_units:
            raise serializers.ValidationError(f"مجموع واحدهای شما بیشتر از حد مجاز ({max_allowed_units} واحد) می‌شود.")

        new_sessions = new_course.sessions.all()
        current_enrollments = Enrollment.objects.filter(student=student, status='enrolled')

        for enrollment in current_enrollments:
            existing_course = enrollment.course
            existing_sessions = existing_course.sessions.all()

            for new_sess in new_sessions:
                for exist_sess in existing_sessions:
                    if new_sess.day == exist_sess.day:
                        if (new_sess.start_time < exist_sess.end_time) and (new_sess.end_time > exist_sess.start_time):
                            raise serializers.ValidationError(
                                f"تداخل زمانی با درس '{existing_course.name}' در روز {new_sess.get_day_display()}"
                            )

        return attrs

    def create(self, validated_data):
        course = validated_data['course']

        with transaction.atomic():
            course_locked = Course.objects.select_for_update().get(pk=course.pk)

            if course_locked.capacity <= 0:
                raise serializers.ValidationError("متاسفانه ظرفیت تکمیل شد.")

            enrollment = super().create(validated_data)

            course_locked.capacity = F('capacity') - 1
            course_locked.save()

            return enrollment