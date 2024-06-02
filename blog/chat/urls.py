# chat/urls.py
from django.urls import path

from .views import *

urlpatterns = [
    # path("", views.index, name="index"),
    # path("<str:room_name>/", views.room, name="room"),
    path('chat_message/', ChatMessageAPI.as_view(), name = "chat_message"),
    path('chat_group/', ChatGroupAPI.as_view(), name = 'chat_group'),
]
