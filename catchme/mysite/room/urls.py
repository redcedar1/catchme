from django.urls import path
from django.contrib.auth import views as auth_views
from .views import room_views
app_name = "room"
urlpatterns = [
    path('api/room_info/',room_views.RoomInfoView.as_view(), name="UserList"),
    path('',room_views.index,name ="index"),
]
