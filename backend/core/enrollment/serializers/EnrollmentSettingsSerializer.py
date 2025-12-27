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

        if min_units is None or max_units is None:
            raise serializers.ValidationError("حداقل و حداکثر واحد نمی‌توانند خالی باشند")
        
        if min_units >= max_units:
            raise serializers.ValidationError(
                "حداقل واحد باید کمتر از حداکثر واحد باشد"
            )

        if min_units <= 0 or max_units <= 0:
            raise serializers.ValidationError(
                "واحدها باید عددی مثبت باشند"
            )
            
        MAX_LIMIT = 50
        if max_units > MAX_LIMIT:
            raise serializers.ValidationError(f"حداکثر واحد نمی‌تواند بیشتر از {MAX_LIMIT} باشد")
        
        return attrs
