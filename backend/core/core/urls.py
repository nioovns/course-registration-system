from django.contrib import admin
from django.urls import path, include , re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import CustomTokenObtainPairView, LogoutView

schema_view = get_schema_view(
   openapi.Info(
      title="Course Registration API",
      default_version='v1',
      description="API Documentation",
   ),
   public=True,
   permission_classes=[permissions.AllowAny,],
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/logout/', LogoutView.as_view(), name='auth_logout'),

    # 2. Users and App Routes
    path('api/users/', include('users.urls')),
    path('api/courses/', include('course.urls')),
    path('api/', include('enrollment.urls')),
    
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    # 3. Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]