from django.db import models

class EnrollmentSettings(models.Model):
    min_units = models.PositiveIntegerField()
    max_units = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if self.is_active:
            EnrollmentSettings.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.min_units} - {self.max_units}"