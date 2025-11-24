from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsAdmin, IsProfessor, IsStudent
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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
