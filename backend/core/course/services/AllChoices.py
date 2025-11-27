from rest_framework.views import APIView
from rest_framework.response import Response
from course.choices import (
    TimeChoices, FacultyChoices, RoomChoices, DayChoices, UnitChoices
)

class AllChoices(APIView):
    def get(self, request):
        time_list = [
            {"label": f"{start}-{end}", "start": start, "end": end}
            for start, end in TimeChoices.TIME_CHOICES
        ]

        faculty_list = [
            {"value": key, "label": name}
            for key, name in FacultyChoices.FACULTY_CHOICES
        ]

        day_list = [
            {"value": d, "label": p}
            for d, p in DayChoices.DAY_CHOICES
        ]

        unit_list = [
            {"value": v, "label": label}
            for v, label in UnitChoices.UNIT_CHOICES
        ]

        return Response({
            "unit_choices": unit_list,
            "day_choices": day_list,
            "time_choices": time_list,
            "faculty_choices": faculty_list,
            "classroom_choices": RoomChoices.ROOM_CHOICES,
        })
