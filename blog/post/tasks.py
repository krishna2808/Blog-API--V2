from .models import *
from account.models import *
from celery import shared_task
import time 

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
    post = Post.objects.get(id = post_id)
    sender_user = User.objects.get(id = sender_id)
    if type == "posted":
        friends = Friend.objects.select_related('friend', 'current_user').filter(friend__id = sender_id,friend_request = 1)
    elif type == "commented" or type == "liked":
        friends = Friend.objects.select_related('friend', 'current_user').filter(current_user__id = sender_id,friend_request = 1)
    print("post_notification -------------- ")
    for friend_object in friends:
        print('post_notification inside ------------- ')
        # time.sleep(5)
        Notification.objects.create(
			sender = sender_user, 
			post =  post, 
            receiver = friend_object.current_user if type == 'posted' else friend_object.friend,
            # receiver = friend_object.current_user,
            notification_type = type
        )
    print("save")
         
