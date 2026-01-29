from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Sum
from .models.Enrollment import Enrollment
from .models.EnrollmentSettings import EnrollmentSettings
from django.db.models import F

def enroll_student(student, course):
    check_capacity(course)
    check_repetition(student, course)
    check_prerequisites(student, course)
    check_time_conflicts(student, course)
    check_unit_limits(student, course)

    with transaction.atomic():
        return Enrollment.objects.create(student=student, course=course)


def withdraw_student(student, enrollment_id):
    try:
        enrollment = Enrollment.objects.get(id=enrollment_id, student=student)
    except Enrollment.DoesNotExist:
        raise ValidationError("این درس یافت نشد.")

    settings = EnrollmentSettings.objects.first()
    if settings and not settings.is_active:
        raise ValidationError("مهلت حذف و اضافه به پایان رسیده است.")

    enrollment.delete()


def check_capacity(course):
    current_count = Enrollment.objects.filter(
        course=course,
        status=Enrollment.Status.ENROLLED
    ).count()

    if current_count >= course.capacity:
        raise ValidationError("ظرفیت این کلاس تکمیل شده است.")


def check_repetition(student, course):
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
    ).select_related('course').prefetch_related('course__sessions')

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


def check_unit_limits(student, course):
    settings = EnrollmentSettings.objects.first()
    if not settings:
        return

    current_units = Enrollment.objects.filter(
        student=student,
        status=Enrollment.Status.ENROLLED
    ).aggregate(total=Sum('course__units'))['total'] or 0

    if current_units + course.units > settings.max_units:
        raise ValidationError(f"سقف مجاز واحد ({settings.max_units}) رعایت نشده است.")


def time_overlap(start1, end1, start2, end2):
    return max(start1, start2) < min(end1, end2)

def professor_remove_student(professor, course_id, student_id):
    with transaction.atomic():
        try:
            enrollment = Enrollment.objects.select_related('course').select_for_update().get(
                    course_id = course_id, 
                    student_id = student_id, 
                    status = Enrollment.Status.ENROLLED, 
                    )
        except Enrollment.DoesNotExist:
            raise ValidationError("دانشجو در این  درس ثبت نام نشده است")
        if enrollment.course.professor != professor.user:
            raise ValidationError("شما اجازه حذف این دانشجو را ندارید")

        course = enrollment.course
        course.capacity = F('capacity') + 1
        course.save(update_fields=['capacity'])
        enrollment.delete()