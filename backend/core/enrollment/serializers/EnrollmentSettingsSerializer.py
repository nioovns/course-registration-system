from rest_framework import serializers
from enrollment.models.EnrollmentSettings import EnrollmentSettings

class EnrollmentSettingsSerializer(serializers.ModelSerializer):
    is_active = serializers.BooleanField(default=True)
    
    class Meta:
        model = EnrollmentSettings
        fields = "__all__"

    def validate(self, attrs):
        min_units = attrs.get("min_units")
        max_units = attrs.get("max_units")

        if min_units >= max_units:
            raise serializers.ValidationError(
                "حداقل واحد باید کمتر از حداکثر واحد باشد"
            )

        return attrs
