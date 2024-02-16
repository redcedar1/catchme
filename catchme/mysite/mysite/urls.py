
from django.contrib import admin
from django.urls import path,include
from common.views import common_base_views
from django.conf import settings
urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('',common_base_views.index),
    path('main/',include('common.urls')),
    path('kakaopay/', include('kakaopay.urls')),
    path('room/',include('room.urls')),

]

