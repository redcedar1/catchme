from django.urls import path
from django.contrib.auth import views as auth_views
from .views import room_views
app_name = "room"
urlpatterns = [
    path('api/room_info/',room_views.RoomListView.as_view(), name="roomListView"),
    path('api/room_info/<int:r_no>/',room_views.SelectedRoomView.as_view(), name="SelectedRoomview"),
    path('api/room_info/idealroom/', room_views.RoomListIdealView.as_view(), name="idealRoomListView"),
    path('api/room_info/percentage/', room_views.UserIdealPercentageView.as_view(), name="percentageListView"),
    path('api/room_info/second/', room_views.RoomSecondRecommendationView.as_view(), name="secondRecommendationView"),
    
    path('',room_views.index,name ="index"),
]
