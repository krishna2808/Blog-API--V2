from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import * 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from account.models import *
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .tasks import * 
from rest_framework.generics import GenericAPIView 
from django.core.cache import cache
import time
import redis

import logging as log
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime , timedelta
from django.db.models import Q
from .pagination import CustomLimitOffsetPagination
from account.serializers import ProfileSerializer


from django.http import JsonResponse
from django.db.models import F
from rest_framework.decorators import api_view, permission_classes


log = log.getLogger(__name__)


def fun(request):
     log.info("function ---------------- ")
     print("print --------------------------", x)
     log.info("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
     return JsonResponse({"msg" : "Unfollow Friend"})



class PostList(generics.ListAPIView):
    # queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
    pagination_class = CustomLimitOffsetPagination
    # def get(self,request,format=None):
    #     friend_queryset = list(Friend.objects.filter(current_user = request.user, friend_request = 1).values("friend"))
    #     post = Post.objects.select_related("user").filter(Q(user__in = friend_queryset) | Q(user__is_private_account=False))
    #     serializer = PostSerializer(post, many=True)
    #     # if "posts" in cache:
    #     #     print("cache ----- ", cache)
    #     #     return Response(cache.get('posts'), status=status.HTTP_200_OK)
    #     # else:
    #     #     friend_queryset = list(Friend.objects.filter(current_user = request.user, friend_request = 1).values("friend"))
    #     #     post = Post.objects.filter(Q(user__in = friend_queryset) | Q(user__is_private_account=False))
    #     #     serializer = PostSerializer(post, many=True)
    #     #     cache.set("posts", serializer.data, timeout=60*60)
    #     return Response(serializer.data, status=status.HTTP_200_OK)
            
        
    def get_queryset(self):
        friend_queryset = list(Friend.objects.filter(current_user = self.request.user, friend_request = 1).values_list("friend", flat=True))
        query = Q(user = self.request.user)| Q(user__in = friend_queryset) | Q(user__is_private_account=False)
        return Post.objects.select_related("user").filter(query)
    
    

class PostCreateAndListAndUpdateDescostory(APIView):
    permission_classes = [IsAuthenticated]
    
    def valid_post_user(self, post_id, user_id):
        try:
            valid_post_user_object = Post.objects.get(id=post_id, user__id = user_id)
        except Post.DoesNotExist:
            raise Http404
        return valid_post_user_object
    
    def get(self, request, format=None):
        post = Post.objects.filter(user__id = request.user.id)
        serializer = PostSerializer(post, many=True)
        following = list(Friend.objects.order_by('-created_datetime').filter(current_user = request.user, friend_request = 1 ).values_list('friend__username', flat=True))
        follower = list(Friend.objects.order_by('-created_datetime').filter(friend  = request.user, friend_request = 1 ).values_list('current_user__username', flat=True))
        friends_context = {
			'following_friends' : following ,
            'follower_friends' : follower,
            'following_count' : len(following),
            'follower_count' : len(follower)
		}                 
        return Response({'own_post' : serializer.data, 'friends_context' : friends_context  }, status=status.HTTP_200_OK)
    def post(self, request, format=None):
        # post_data = request.data.copy()
        # post_data['user'] = request.user.id
        request.data['user'] = request.user.id
        # post_data = request.data 
        serializer = PostSerializer(data=request.data) 
        if serializer.is_valid():
            print("save -------- ")
            serializer.save()
            post_notification.delay(request.user.id, post_id = serializer.data['id'], type = "posted")
            # post_notification(request.user.id, post_id = serializer.data['id'], type = "posted")
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, format=None):
        user_id = request.user.id
        request.data['user'] = user_id
        post_id = request.data['post_id']
        post_object = self.valid_post_user(post_id, user_id)
        post_data = request.data
        serializer = PostSerializer(post_object, data=post_data, partial=True) 
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        user_id = request.user.id
        post_id = request.data['post_id']
        request.data['user'] = user_id
        post_object = self.valid_post_user(post_id, user_id)
        post_object.delete()
        return Response({"msg" : "Post deleted"}, status=status.HTTP_204_NO_CONTENT)    




class UserProfileAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, format=None):
        """
        is_friend = -1 : no friend.
        is_friend = 0  : Friend requeste send or follow and wait to accept request
        is_friend = 1  : Friend requested accepted (followed)
        """
        print("request-data -------- ", request.data )
        is_friend = 1
        post_count = 0 
        username = request.data.get('username')
        user = User.objects.get(username = username)
        
        is_same_user = True if request.user.username == username else False
        friends = Friend.objects.filter(current_user = request.user, friend__username = username)

        if friends.exists():
            is_requested = friends.first().friend_request
            if is_requested == 0:
                is_friend = 0
                post = Post.objects.none()
                post_count = Post.objects.filter(user__username = username).count() 
            elif is_requested == 1:
                is_friend = 1
                post = Post.objects.filter(user__username = username) 
                post_count = post.count()
        else:
            is_friend = -1
            post = Post.objects.none()
            post_count = Post.objects.filter(user__username = username).count() 


        if is_same_user:
            post = Post.objects.filter(user__username = username)
            post_count = post.count()
        elif user.is_private_account == 1:
            pass 
        else:

            post = Post.objects.filter(user__username = username)
            post_count = post.count()
                
        serializer_profile = ProfileSerializer(user)
        serializer = PostSerializer(post, many=True)
        following = list(
            Friend.objects.select_related("friend", "current_user").order_by('-created_datetime').filter(
                current_user__username = username, 
                friend_request = 1 ).values(
                    username=F('friend__username'),  # Alias friend__username to username
                    image=F('friend__image')          # Alias friend__image to image
                    )
            )
        follower = list(
            Friend.objects.select_related("friend", "current_user").order_by('-created_datetime').filter(
                friend__username  = username, 
                friend_request = 1 ).values(
                    username = F('current_user__username'), 
                    image = F('current_user__image') 
                    )
            )
        friends_context = {
            'following_friends' : following ,
            'follower_friends' : follower,
            'following_count' : len(following),
            'follower_count' : len(follower),
            'is_same_user' : is_same_user,
            'is_friend' : is_friend,
            'post_count' : post_count
        
		}      
        response_data = {
            'user_post' : serializer.data, 
            'friends_context' : friends_context,
            'user_profile' : serializer_profile.data 
        }           
        return Response(response_data ,status=status.HTTP_200_OK)
        
class CommentAPI(APIView):
    def get_object(self,comment_id):
        try:
            comment_object =  Comment.objects.get(id = comment_id)
        except Comment.DoesNotExist:
            raise Http404
        return comment_object

    def post(self, request, format=None):
        request.data['user'] = request.user.id
        request.data['post'] = request.data.get('post_id')
        comment_data = request.data 
        serializer = CommentSerilizer(data=comment_data) 
        if serializer.is_valid():
            serializer.save()
            post_notification.delay(request.user.id, post_id = serializer.data['post'], type = "commented")
            # post_notification(request.user.id, post_id = serializer.data['post'], type = "commented")
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, format=None):
        comment_id = request.data.get('comment_id')
        comment_object = self.get_object(comment_id)
        serializer = CommentSerilizer(comment_object, data = request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def delete(self, request, format=None):
        comment_id = request.data.get('comment_id')
        comment_object = self.get_object(comment_id)
        comment_object.delete()
        return Response({"msg" : "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)    
        

class LikeAPI(APIView):
    def get_object(self,like_id):
        try:
            like_object =  Like.objects.get(id = like_id)
        except Like.DoesNotExist:
            raise Http404
        return like_object

    def post(self, request, format=None):

        request.data['user'] = request.user.id
        request.data['post'] = request.data.get('post_id')
        comment_data = request.data 
        serializer = LikeSerializer(data=comment_data) 
        if serializer.is_valid():
            serializer.save()
            post_notification.delay(request.user.id, post_id = serializer.data['post'], type = "liked")
            # post_notification(request.user.id, post_id = serializer.data['post'], type = "liked")
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, format=None):
        like_id = request.data.get('like_id')
        like_object = self.get_object(like_id)
        serializer = LikeSerializer(like_object, data = request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def delete(self, request, format=None):
        like_id = request.data.get('like_id')
        like_object = self.get_object(like_id)
        like_object.delete()
        return Response({"msg" : "Like deleted"}, status=status.HTTP_204_NO_CONTENT)    
        

class FriendRequestAPI(APIView):
    
    permission_classes = [IsAuthenticated]
    def get(self, request, format= None):
        friends_requests = Friend.objects.filter(friend = request.user, friend_request =  0)
        serializer = FriendRequestSerializer(friends_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request, format=None):
        user =  User.objects.get(username = request.data.get('friend_request_username')) 
        request.data['current_user'] = request.user.id
        request.data['friend'] = user.id
        if not Friend.objects.filter(current_user__id = request.user.id, friend__id = user.id).exists():
            if user.is_private_account:
                request.data['friend_request'] =  0 
            else:
                request.data['friend_request'] =  1
            serializer = FriendRequestSerializer(data = request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"msg" : "Error friend request is already available"}, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, format=None):
        accept_request_user =  User.objects.get(username = request.data.get('accept_friend_request_username')) 
        request.data['current_user'] = accept_request_user.id
        request.data['friend'] = request.user.id
        friend = Friend.objects.get(current_user = accept_request_user, friend = request.user)
        serializer = FriendRequestSerializer(friend, data = request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
    
    
    def delete(self, request, format=None):
        user_action = request.data.get("action")
        if user_action == "cancel_friend_request":
            username = request.data.get('cancel_friend_request_username')
            friend  = request.user
            current_user = User.objects.get(username = username)
            pass 
        elif user_action == "unfollow_friend":
            username = request.data.get('friend_unfollow_username')
            friend  = User.objects.get(username = username)  
            current_user = User.objects.get(id = request.user.id)
        friend_object = Friend.objects.filter(current_user = current_user, friend = friend)
        friend_object.delete()
        return Response({"msg" : "Unfollow Friend"}, status=status.HTTP_204_NO_CONTENT)   
    
class NotificationAPI(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(receiver = user)
    
    def put(self, request, pk=None ):
        instance = self.get_object()
        serializer = NotificationSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class SearchUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        query = request.GET.get('query', '')
        if len(query) >= 3:            
            users = list(User.objects.filter(username__icontains=query).values("username"))
            return Response({"data": users})
        return Response({"data": ''})
    



@permission_classes([IsAuthenticated])
@api_view(['GET', 'POST'])
def total_friend_request(request):
    if request.method == "GET":
        login_user = request.user 
        total_friend_request = Friend.objects.filter(friend = login_user, friend_request = 0).count()
        response = {
            "total_friend_request" : total_friend_request
        }
        return Response(response, status=status.HTTP_200_OK)
    return Response({"msg" : "Invaild Method"}, status=status.HTTP_400_BAD_REQUEST)
        
    
class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer