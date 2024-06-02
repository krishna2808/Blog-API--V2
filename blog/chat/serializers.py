
from rest_framework import serializers
from .models import *



class ChatMessageSerializer(serializers.ModelSerializer):
    
    chat_room = serializers.StringRelatedField(source='room.roomId')
    # chat_room1 = ChatRoomSerializer(many=True, read_only=True)
    sender = serializers.StringRelatedField(source='sender.username')
    class Meta:
        model = ChatMessage
        fields = ['id',  'message', 'sender', 'timestamp', 'chat_room']


class ChatRoomSerializer(serializers.ModelSerializer):
    chat_room = ChatMessageSerializer(many=True, read_only=True)
    class Meta:
        model = ChatRoom
        fields = ['id', 'roomId', 'chat_room', 'type', "name", "members"]