# chat/views.py
from django.shortcuts import render
from django.utils.safestring import mark_safe
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import * 
from .models import * 
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q




import json

def index(request):
    return render(request, "chat/index.html")

@login_required
def room(request, room_name):
    # return render(request, "chat/room.html", {"room_name": room_name})
    return render(request, "chat/chat.html", {
        "room_name_json": mark_safe(json.dumps(room_name)),
        'username' : mark_safe(json.dumps(request.user.username))
    })
    
    


class ChatMessageAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format= None):
        chat_room_queryset = ChatRoom.objects.filter(members = request.user.id)
        serializer = ChatRoomSerializer(chat_room_queryset , many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request , format=None):
        username = request.data.get("username")
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_id_lst = list(User.objects.filter(username = username).values_list("id", flat=True))
        if not user_id_lst:
            return Response({"error": "User(s) not found"}, status=status.HTTP_404_NOT_FOUND)
    
        add_users_room_ids = [request.user.id] + user_id_lst 
        # chat_message_queryset = ChatRoom.objects.filter(
        #     members__id = request.user.id , 
        #     members = User.objects.filter(username = username).first() , 
        #     type="DM"
        # )
        # print("chat_message_queryset ------ ", chat_message_queryset)
        # print("Queryset:", chat_message_queryset.query)
        # if chat_message_queryset.exists():
        #     return Response({"msg": "direct message is already available"}, status=status.HTTP_200_OK)
        
        request.data["type"] = "DM"
        request.data["members"] = add_users_room_ids
        request.data["name"] = "direct message"
        
        serializer = ChatRoomSerializer(data = request.data )
        if serializer.is_valid():
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, format=None):
        try:
            chat_room_id = request.data.get("chat_room_id")
            if not chat_room_id:
                return Response({"error": "Usernames list is required"}, status=status.HTTP_400_BAD_REQUEST)
            chat_room_id = chat_room_id
            ChatRoom.objects.get(id = chat_room_id).delete()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)
        
class ChatGroupAPI(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        
        usernames_list = request.data.get("usernames")
        if not usernames_list:
            return Response({"error": "Usernames list is required"}, status=status.HTTP_400_BAD_REQUEST)

        users_ids_lst = list(User.objects.filter(username__in = usernames_list).values_list("id", flat=True))
        joined_users_ids = [request.user.id] + users_ids_lst 
        
        request.data["type"] = "GROUP"
        request.data["members"] = joined_users_ids
        serializer = ChatRoomSerializer(data = request.data )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, format=None):
        group_action = request.data.get("group_action")
        usernames_list = request.data.get("usernames")
        chat_room_id = request.data.get("chat_room_id")
        users_ids_lst = list(User.objects.filter(username__in = usernames_list).values_list("id", flat=True))
        chat_room_object = ChatRoom.objects.get(id = chat_room_id)
        if group_action == "remove_user":
            chat_room_object.members.remove(*users_ids_lst)
        elif group_action == "add_user":
            chat_room_object.members.add(*users_ids_lst)
        serializer = ChatRoomSerializer(chat_room_object, data=request.data, partial=True) 
        if serializer.is_valid():
            serializer.save()

        return Response(serializer.data , status=status.HTTP_200_OK)
    
    def delete(self, request, format=None):
        try:
            chat_room_id = request.data.get("chat_room_id")
            if not chat_room_id:
                return Response({"error": "Usernames list is required"}, status=status.HTTP_400_BAD_REQUEST)
            chat_room_id = chat_room_id
            ChatRoom.objects.get(id = chat_room_id).delete()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)
        
            
         
    
    
    