from django.core.exceptions import ValidationError
from datetime import time

MIN_TIME = time(8,0)
MAX_TIME = time(20,0)

def validate_time_range(start_time, end_time):
    if start_time >= end_time:
        raise ValidationError("end_time must be later than start_time.")
    
    if start_time < MIN_TIME or end_time > MAX_TIME:
        raise ValidationError(f"Class times must be between {MIN_TIME.strftime('%H:%M')} and {MAX_TIME.strftime('%H:%M')}.")