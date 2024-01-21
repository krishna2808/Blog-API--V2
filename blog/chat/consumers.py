# chat/consumers.py
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message
from account.models import User

class ChatConsumer(WebsocketConsumer):
    def message_to_json(self, message):
        return {
			'username' : message.user.username,
            'message'  : message.message,
            'create_datetime' : str(message.created_datetime)
		}
    def messages_to_json(self, messages):
        result = []
        for message in messages:
            result.append(self.message_to_json(message))
        return result
        
    def fetch_old_messages(self, data):
        message = Message.objects.order_by('-created_datetime').all()[:10]
        content = {
			'message' : self.messages_to_json(message),
            'command': 'fetch_old_messages'
		}
        print("fetch_message")

        # async_to_sync(self.channel_layer.group_send)(
        #     self.room_group_name, {"type": "send.message", "message": content}
        # )
        self.send_old_message(content)

    def new_message(self, data):
        username = data['from']
        user_object = User.objects.filter(username = username).first()
        message= Message.objects.create(
			user = user_object,
            message = data['message'],
		)
        content = {
			'command' : 'new_message',
            'message' : self.message_to_json(message)
		}
        print("new_message")
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat.message", "message": content}
        )
        # self.chat_message(content)
    
    commands = {
		'fetch_old_messages' : fetch_old_messages,
        'new_message' : new_message
	}
    
    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)
        
    def send_chat_message(self, message):
        # Send message to room group
        print('send_chat_message -----------')
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, {"type": "chat.message", "message": message}
        )
 
 
    # Old Receive message from fetch message function and send message to websocket
    def send_old_message(self, message):
        print('message from send_message', message)
        self.send(text_data=json.dumps({"message": message}))
    
    
    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        print('message ------- ', message)
        print(event, 'event ------------')
        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))