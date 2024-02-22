from django.urls import include, path
from django.contrib.auth import views as auth_views
from common.views import common_base_views , common_user_views
from common.views.common_user_views import UserViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter

userRouter = DefaultRouter()
userRouter.register(r'api/user_info', UserViewSet, basename='userinfo')

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
    path('api/user_info/<str:kid>/notice',common_user_views.UserNoticeView.as_view()),
    
    #changing to viewset
    path('', include(userRouter.urls)),
    
    #simplejwt token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]
