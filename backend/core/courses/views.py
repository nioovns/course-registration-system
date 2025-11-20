from django.http import JsonResponse

def test_courses(request):
    return JsonResponse({"message": "Courses app is working!"})
