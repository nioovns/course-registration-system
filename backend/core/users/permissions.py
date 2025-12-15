from rest_framework.permissions import BasePermission , SAFE_METHODS

class IsAdmin(BasePermission):
    def has_permission(self, request, view):

        return bool(request.user and request.user.is_authenticated and request.user.is_admin_role)

class IsProfessor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_professor)

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_student)

class IsAdminOrStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_admin_role or request.user.is_student))