from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsAdmin, IsProfessor, IsStudent

class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        return Response({"message": "Welcome Admin!"})

class ProfessorDashboardView(APIView):
    permission_classes = [IsProfessor]

    def get(self, request):
        return Response({"message": "Welcome Professor!"})
