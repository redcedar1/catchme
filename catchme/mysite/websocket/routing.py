from django.urls import re_path
from .consumers import consumers

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<room_name>\w+)/$', consumers.DataConsumer.as_asgi()),
]