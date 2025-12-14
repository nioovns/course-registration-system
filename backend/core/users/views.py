from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Student
from .serializers import CustomTokenObtainPairSerializer, UserSerializer, StudentListSerializer
from .permissions import IsStudent, IsProfessor, IsAdmin


# Login View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Logout View
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class StudentDashboardView(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        # دسترسی به آبجکت Student از طریق related_name
        profile = getattr(request.user, 'student', None)
        msg = f"Welcome {profile.first_name}" if profile else "Welcome Student"
        return Response({
            "message": msg,
            "student_id": profile.student_id if profile else None
        })


class ProfessorDashboardView(APIView):
    permission_classes = [IsProfessor]

    def get(self, request):
        profile = getattr(request.user, 'professor', None)
        msg = f"Welcome Professor {profile.last_name}" if profile else "Welcome Professor"
        return Response({"message": msg})

class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]
    def get(self, request):
        students = Student.objects.all().select_related('user')
        serializer = StudentListSerializer(students, many=True)
        return Response({
            "message": f"Welcome Admin {request.user.username}!",
            "students_count": students.count(),
            "students": serializer.data
        })