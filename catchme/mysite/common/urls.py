from django.urls import path
from django.contrib.auth import views as auth_views
from common.views import common_base_views




app_name = "common"
urlpatterns = [
    path('',common_base_views.index, name='index'),
    path('introduction/',common_base_views.introduction, name = "introduction"),
    path('kakaoLoginLogic/',common_base_views.kakaoLoginLogic,name="kakaoLoginLogic"),
    path('kakaoLoginLogicRedirect/', common_base_views.kakaoLoginLogicRedirect,name="kakaoLoginLogicRedirect"),
    path('kakaoLogout/', common_base_views.kakaoLogout,name="kakaoLogout"),
    path('csrf/',common_base_views.csrf)

]
