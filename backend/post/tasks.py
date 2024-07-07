from .models import *
from account.models import *
from celery import shared_task
import time 
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json


channel_layer = get_channel_layer()

# @shared_task()
# def post_notification(sender_id, post_id, type):
#     post = Post.objects.get(id = post_id)
#     sender_user = User.objects.get(id = sender_id)
#     friends = Friend.objects.select_related('friend').filter(current_user__id = sender_id,friend_request = 1)
#     print("post_notification -------------- ")
#     for friend_object in friends:
#         print('post_notification inside ------------- ')
#         time.sleep(5)
#         Notification.objects.create(
# 			sender = sender_user, 
# 			post =  post, 
#             receiver = friend_object.friend,
#             notification_type = type
#         )
#     print("save")


@shared_task()
def post_notification(sender_id, post_id, type):
    print("---------calling notification ----- ")
    post = Post.objects.get(id = post_id)
    sender_user = User.objects.get(id = sender_id)
    if type == "posted":
        friends = Friend.objects.select_related('friend', 'current_user').filter(friend__id = sender_id,friend_request = 1)
    elif type == "commented" or type == "liked":
        friends = Friend.objects.select_related('friend', 'current_user').filter(current_user__id = sender_id,friend_request = 1)
    print("post_notification ---------------------- ")
    for friend_object in friends:
        print('post_notification inside ------------- ')
        # time.sleep(5)
        notification_content = f"{sender_user.username} is {type} new post" if type == "posted" else f"{friend_object.friend} is {type} your post"
        receiver = friend_object.current_user if type == 'posted' else friend_object.friend

        notification = Notification.objects.create(
            notification_content = notification_content,
            sender = sender_user, 
            post =  post, 
            receiver = receiver,
            # receiver = friend_object.current_user,
            notification_type = type
        )
                
        # Send notification via WebSocket
        notification_message = {
            'id': notification.id,
            'content': notification_content,
            'sender_username': sender_user.username,
            'sender_image': str(sender_user.image.url) if sender_user.image else '',  # Ensure the URL is a string
            'receiver_username': receiver.username,
            'post': notification.post.title,
            'status': notification.status,
            'notification_type': type,
            'created_datetime': notification.created_datetime.isoformat()  # Ensure the datetime is a string
        }
        async_to_sync(channel_layer.group_send)(
            f'notification_{receiver.id}',  # Group name
            {
                'type': 'send_notification',  # Method name in consumer
                'message': notification_message,  
            }
        )
    print("save")