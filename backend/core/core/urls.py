from django.contrib import admin
#from django.contrib.auth.views import LogoutView
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from backend.core.users.views import LogoutView , CustomTokenObtainPairView

# تنظیمات سواگر (Swagger)
schema_view = get_schema_view(
   openapi.Info(
      title="Course Registration API",
      default_version='v1',
      description="API Documentation for Course Registration System",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@local.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# همه آدرس‌ها در یک لیست واحد
urlpatterns = [
    # 1 admin panel
    path('admin/', admin.site.urls),

    path('api/users/', include('users.urls')),


    # 2 (JWT)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='auth_logout'),

    #path('api/users/', include('users.urls')),

    # 3 documentation API (Swagger & Redoc)
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]