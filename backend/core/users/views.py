from django.http import JsonResponse

def test_users(request):
    return JsonResponse({"message": "Users app is working!"})
from django.shortcuts import render

# Create your views here.
