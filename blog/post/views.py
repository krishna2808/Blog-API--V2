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

import logging as log
from drf_yasg.utils import swagger_auto_schema


class PostList(generics.ListAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = PostSerializer
from rest_framework.generics import GenericAPIView 

class PostCreateAndListAndUpdateDescostory(APIView):
    permission_classes = [IsAuthenticated]
    
    def valid_post_user(self, post_id, user_id):
        try:
            valid_post_user = Post.objects.get(id=post_id, user__id = user_id)
        except Post.DoesNotExist:
            raise Http404
        return valid_post_user
    
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
        log.info('post ----------')
        request.data['user'] = request.user.id
        post_data = request.data 
        serializer = PostSerializer(data=post_data) 
        if serializer.is_valid():
            serializer.save()
            post_notification.delay(request.user.id, post_id = serializer.data['id'], type = "posted")
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




class ShowUserPost(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, format=None):
        username = request.data.get('username')
        user = User.objects.get(username = username)
        if user.is_private_account == 1:
            if Friend.objects.filter(current_user = request.user, friend__username = username, friend_request = 1 ).exists():
                post = Post.objects.filter(user__username = username) 
            else:
                post = Post.objects.none()
        else:
            post = Post.objects.filter(user__username = username)
        serializer = PostSerializer(post, many=True)
        following = list(Friend.objects.order_by('-created_datetime').filter(current_user__username = username, friend_request = 1 ).values_list('friend', flat=True))
        follower = list(Friend.objects.order_by('-created_datetime').filter(friend__username  = username, friend_request = 1 ).values_list('current_user', flat=True))
        friends_context = {
			'following_friends' : following ,
			'follower_friends' : follower,
			'following_count' : len(following),
			'follower_count' : len(follower)
		}                 
        return Response({'user_post' : serializer.data, 'friends_context' : friends_context }, status=status.HTTP_200_OK)
        
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
          
    def delete(self, request, format=None):
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
  