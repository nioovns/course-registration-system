from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsAdmin, IsProfessor, IsStudent
