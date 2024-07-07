from email.mime import image
from rest_framework import serializers
from .models import *
from account.models import * 



class CommentSerilizer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(source='user.uesrname')
    user_image = serializers.StringRelatedField(source='user.image')
    class Meta:
        model = Comment
        fields = ['id',  'user', 'username', 'user_image', 'post', 'comment', 'created_datetime']   


class LikeSerializer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(source='user.username')
    user_image = serializers.StringRelatedField(source='user.image')
        
    class Meta:
        model = Like
        fields = ['id', 'user', 'username', 'user_image', 'post', 'created_datetime']

class PostSerializer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(source='user.username')
    user_image = serializers.StringRelatedField(source='user.image')
    # related name should be same with field name then it will get result all related child.
    post_comment = CommentSerilizer(many=True, read_only=True)
    post_like = LikeSerializer(many=True, read_only=True)
    class Meta:
        model = Post 
        fields = ['id', 'username', 'user_image', 'user', 'title', 'file',  'description', 'created_datetime', 'post_comment', 'post_like']
       

class ShowOwnPostSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()
    # def get_image(self, obj):
    #         return self.context['request'].build_absolute_uri( obj.image.url)
    email = serializers.StringRelatedField(source='user.email')

    class Meta:
        model = Post 
        fields = ['email', 'title',  'description', 'created_datetime']

class FriendRequestSerializer(serializers.ModelSerializer):
    current_user_username = serializers.StringRelatedField(source='current_user.username')
    friend_username = serializers.StringRelatedField(source='friend.username')
    friend_image = serializers.StringRelatedField(source='friend.image')
    class Meta:
        model = Friend 
        fields = [
            'id', 'current_user', 
            'friend', 'current_user_username', 
            'friend_username', 'friend_image',
            'friend_request', 'created_datetime'
        ]

class NotificationSerializer(serializers.ModelSerializer):
    sender_username = serializers.StringRelatedField(source='sender.username')
    receiver_username = serializers.StringRelatedField(source='receiver.username')
    sender_image = serializers.StringRelatedField(source='sender.image')
    class Meta:
        model = Notification
        fields = ['id', 'sender', 'sender_image', 'sender_username', 'post', 'receiver', 'receiver_username',  'status', 'notification_type', 'created_datetime' ]