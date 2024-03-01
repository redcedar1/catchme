
from django.contrib import admin
from django.urls import path,include, re_path
from common.views import common_base_views
from django.conf import settings
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="API 문서",
      default_version='v1',
      description="API에 대한 문서입니다.",
      terms_of_service="URL",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('',common_base_views.index),
    path('main/',include('common.urls')),
    path('kakaopay/', include('kakaopay.urls')),
    path('room/',include('room.urls')),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

