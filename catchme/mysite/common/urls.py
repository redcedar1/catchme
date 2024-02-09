from django.urls import path
from django.contrib.auth import views as auth_views
from common.views import common_base_views , common_user_views




app_name = "common"
urlpatterns = [
    #common_base_views.py
    path('',common_base_views.index, name='index'),
    path('introduction/',common_base_views.introduction, name = "introduction"),
    path('kakaoLoginLogic/',common_base_views.kakaoLoginLogic,name="kakaoLoginLogic"),
    path('kakaoLoginLogicRedirect/', common_base_views.kakaoLoginLogicRedirect,name="kakaoLoginLogicRedirect"),
    path('kakaoLogout/', common_base_views.kakaoLogout,name="kakaoLogout"),
    path('csrf/',common_base_views.csrf),
    
    #common_user_views.py
    path('api/user_info/<int:kid>',common_user_views.UserView.as_view()),# str을 int로 바꾸는 과정 필요
    path('api/user_info/<int:kid>/notice',common_user_views.UserNoticeView.as_view()),
    

]
