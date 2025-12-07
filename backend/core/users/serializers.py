from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['role'] = user.role
        token['username'] = user.username

        if user.is_student and user.student_id:
            token['student_id'] = user.student_id
        if user.is_professor and user.professor_code:
            token['professor_code'] = user.professor_code

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.update({
            'role': self.user.role,
            'username': self.user.username,
            'user_id': self.user.id ,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        })
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'student_id', 'professor_code']