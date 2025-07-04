# chat/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/notification/", consumers.NotificationConsumer.as_asgi()),
    re_path(
        r'ws/chat/(?P<room_id>\w+)/$',  # This is the correct way to capture the room_id in the URL
        consumers.ChatConsumer.as_asgi()
    ),
]