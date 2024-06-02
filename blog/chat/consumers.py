# chat/consumers.py
# consumer means it is nothing but views file.
import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import *
from .serializers import ChatRoomSerializer
from account.models import User
import json



class ChatConsumer(AsyncWebsocketConsumer):
    # def getUser(self, userId):
    #     return User.objects.get(id=userId)

    # def getOnlineUsers(self):
    #     onlineUsers = OnlineUser.objects.all()
    #     return [onlineUser.user.id for onlineUser in onlineUsers]

    # def addOnlineUser(self, user):
    #     try:
    #         OnlineUser.objects.create(user=user)
    #     except:
    #         pass

    # def deleteOnlineUser(self, user):
    #     try:
    #         OnlineUser.objects.get(user=user).delete()
    #     except:
    #         pass

    def load_old_message(self, id):
        pass 

    def saveMessage(self, message, userId, roomId):
        userObj = User.objects.get(id=userId)
        chatObj = ChatRoom.objects.get(roomId=roomId)
        chatMessageObj = ChatMessage.objects.create(
            room=chatObj, sender=userObj, message=message
        )
        print("........... save message ")
        return {
            "action": "message",
            "user": userId,
            "roomId": roomId,
            "message": message,
            "userImage": userObj.image.url if userObj.image.name else '',
            "userName": userObj.first_name + " " + userObj.last_name if userObj.first_name and userObj.last_name else '',
            "timestamp": str(chatMessageObj.timestamp),
        }

    # async def sendOnlineUserList(self):
    #     onlineUserList = await database_sync_to_async(self.getOnlineUsers)()
    #     chatMessage = {
    #         "type": "chat_message",
    #         "message": {"action": "onlineUser", "userList": onlineUserList},
    #     }
    #     await self.channel_layer.group_send("onlineUser", chatMessage)




    async def connect(self):
        print("............ connect socket ")
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.userId = self.user.id
            
            self.userRooms = await database_sync_to_async(list)(
            ChatRoom.objects.filter(members=self.userId)
            )
            for room in self.userRooms:
                await self.channel_layer.group_add(room.roomId, self.channel_name)

            # await self.channel_layer.group_add("onlineUser", self.channel_name)
            # self.user = await database_sync_to_async(self.getUser)(self.userId)
            # await database_sync_to_async(self.addOnlineUser)(self.user)
            # await self.sendOnlineUserList()
            await self.accept()
        else:
            await self.close()


    async def disconnect(self, close_code):
        # await database_sync_to_async(self.deleteOnlineUser)(self.user)
        # await self.sendOnlineUserList()
        for room in self.userRooms:
            await self.channel_layer.group_discard(room.roomId, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json["action"]
        roomId = text_data_json["roomId"]
        print("roomId ------- ", roomId)
        chatMessage = {}
        if action == "message":
            message = text_data_json["message"]
            # userId = text_data_json["user"]
            chatMessage = await database_sync_to_async(self.saveMessage)(
                # message, userId, roomId
                message, self.userId, roomId
            )
        elif action == "typing":
            chatMessage = text_data_json
        
        await self.channel_layer.group_send(
            roomId, {"type": "chat_message", "message": chatMessage}
        )
        


    async def chat_message(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps(message))
        






























class NotificationConsumer(AsyncWebsocketConsumer):


    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.group_name = f'notification_{self.user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        else:
            await self.close()



    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        print("text_data ---------- ", text_data, type(text_data))
        # text_data_json = json.loads(text_data)
        print("text_data_json --------- ", text_data, type(text_data))
        # message = text_data_json["message"]
        message = text_data
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.group_name, {"type": "send_notification", "message": message}
        )

    # send message from websocket to client 
    async def send_notification(self, even):
        # print("even ----------- ", even)
        message = even["message"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message})) 









class ChatConsumer1(WebsocketConsumer):
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
		self.room_name = self.scope["url_route"]["kwargs"]["	"]
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