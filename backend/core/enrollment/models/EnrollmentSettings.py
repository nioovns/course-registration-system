from django.db import models

class EnrollmentSettings(models.Model):
    min_units = models.PositiveIntegerField()
    max_units = models.PositiveIntegerField()
    is_active = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.min_units} - {self.max_units}"
    