from django.utils.translation import gettext_lazy as _

class TimeChoices:
    TIME_CHOICES = [
        ("08:00", "10:00"),
        ("10:00", "12:00"),
        ("14:00", "16:00"),
        ("16:00", "18:00"),
        ("18:00", "20:00"),
    ]

class FacultyChoices:
    FACULTY_CHOICES = [
        ("eng", _("دانشکده فنی و مهندسی")),
        ("sci", _("دانشکده علوم")),
        ("lit", _("دانشکده ادبیات")),
        ("psy", _("دانشکده روان شناسی")),
        ("art", _("دانشکده هنر")),
    ]

class RoomChoices:
    ROOM_CHOICES = {
        "eng": [101,102,103,201,202,203],
        "sci": [500,501,502,503,600,601,602,603],
        "lit": [300,301,302,303,304,305,306],
        "psy": [40,42,44,46,48,50],
        "art": [90,91,92,93,94,95,96,97,98]
    }

class DayChoices:
    DAY_CHOICES = [
        ('sat', 'شنبه'),
        ('sun', 'یکشنبه'),
        ('mon', 'دوشنبه'),
        ('tue', 'سه‌شنبه'),
        ('wed', 'چهارشنبه'),
    ]

class UnitChoices:
    UNIT_CHOICES = [
        (1, '1'),
        (2, '2'),
        (3, '3'),
    ]
