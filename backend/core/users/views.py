from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsAdmin, IsProfessor, IsStudent
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "خروج با موفقیت انجام شد"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "توکن نامعتبر است"}, status=status.HTTP_400_BAD_REQUEST)


class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({"message": "Welcome Admin!"})

class ProfessorDashboardView(APIView):
    permission_classes = [IsProfessor]

    def get(self, request):
        return Response({"message": "Welcome Professor!"})

class StudentDashboardView(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        return Response({"message": "Welcome Student!"})
