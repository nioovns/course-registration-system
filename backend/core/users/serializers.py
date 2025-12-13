from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['role'] = self.user.role

        try:
            if self.user.is_student and hasattr(self.user, 'student'):
                data['profile_id'] = self.user.student.id
                data['student_id'] = self.user.student.student_id
                data['full_name'] = f"{self.user.student.first_name} {self.user.student.last_name}"

            elif self.user.is_professor and hasattr(self.user, 'professor'):
                data['profile_id'] = self.user.professor.id
                data['professor_code'] = self.user.professor.professor_code
                data['full_name'] = f"{self.user.professor.first_name} {self.user.professor.last_name}"

            elif self.user.is_admin_role:
                data['full_name'] = "Admin User"

        except Exception as e:
            print(f"Profile Error: {e}")
            data['profile_error'] = "Profile data missing"

        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']