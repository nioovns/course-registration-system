from django.core.exceptions import ValidationError
from .models.Enrollment import Enrollment


def enroll_student(student, course):

    check_capacity(course)

    check_repetition(student, course)

    check_prerequisites(student, course)

    check_time_conflicts(student, course)

    return Enrollment.objects.create(student=student, course=course)


def check_capacity(course):
    current_count = Enrollment.objects.filter(
        course=course,
        status=Enrollment.Status.ENROLLED
    ).count()

    if current_count >= course.capacity:
        raise ValidationError("ظرفیت این کلاس تکمیل شده است.")


def check_repetition(student, course):
    # چک کنیم آیا قبلاً این درس را پاس کرده؟
    passed = Enrollment.objects.filter(
        student=student,
        course=course,
        status=Enrollment.Status.PASSED
    ).exists()
    if passed:
        raise ValidationError("شما این درس را قبلاً پاس کرده‌اید.")

    already_enrolled = Enrollment.objects.filter(
        student=student,
        course=course,
        status=Enrollment.Status.ENROLLED
    ).exists()
    if already_enrolled:
        raise ValidationError("شما این درس را در همین ترم اخذ کرده‌اید.")


def check_prerequisites(student, course):
    prerequisites = course.prerequisites.all()
    if not prerequisites.exists():
        return

    passed_ids = Enrollment.objects.filter(
        student=student,
        status=Enrollment.Status.PASSED
    ).values_list('course_id', flat=True)

    missing = []
    for prereq in prerequisites:
        if prereq.id not in passed_ids:
            missing.append(prereq.name)

    if missing:
        raise ValidationError(f"پیش‌نیازهای زیر رعایت نشده‌اند: {', '.join(missing)}")


def check_time_conflicts(student, new_course):
    current_enrollments = Enrollment.objects.filter(
        student=student,
        status=Enrollment.Status.ENROLLED
    ).select_related('course')

    new_sessions = new_course.sessions.all()

    for enrollment in current_enrollments:
        existing_course = enrollment.course
        existing_sessions = existing_course.sessions.all()

        for new_sess in new_sessions:
            for exist_sess in existing_sessions:
                if new_sess.day == exist_sess.day:
                    if time_overlap(new_sess.start_time, new_sess.end_time,
                                    exist_sess.start_time, exist_sess.end_time):
                        raise ValidationError(
                            f"تداخل زمانی با درس '{existing_course.name}' "
                            f"(روز {new_sess.get_day_display()} ساعت {new_sess.start_time})"
                        )


def time_overlap(start1, end1, start2, end2):
    return max(start1, start2) < min(end1, end2)