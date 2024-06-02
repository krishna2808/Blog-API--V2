from django.db import models
from account.models import User
# Create your models here.

class Message(models.Model):
    user = models.ForeignKey(User, related_name = "user_message", on_delete=models.CASCADE) 
    message = models.TextField()
    modified_datetime = models.DateTimeField(auto_now=True)
    created_datetime = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.user.username
    
    # def last_ten_message(self):
    #     return Message.objects.order_by('-create_datetime').all()[:10]
    
    
from django.db import models
from shortuuidfield import ShortUUIDField
from account.models import User

class ChatRoom(models.Model):
    roomId = ShortUUIDField()
    type = models.CharField(max_length=10, default='DM')
    members = models.ManyToManyField(User)
    name = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return self.roomId + ' -> ' + str(self.name)

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.SET_NULL, null=True, related_name='chat_room')
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='user_chat')
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message
    class Meta:
        ordering = ["-timestamp"]


class OnlineUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username