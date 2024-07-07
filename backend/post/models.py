from django.db import models

# Create your models here.

from account.models import User 
import datetime 

# Create your models here.


class Post(models.Model):
    user = models.ForeignKey(User, related_name='user_post',  on_delete=models.CASCADE)
    title = models.CharField(max_length=40)
    file = models.FileField(upload_to='post_files',null=True, blank=True)
    description = models.CharField(max_length=500)
    created_datetime = models.DateTimeField(auto_now_add=True)
    modified_datetime = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.title
    class Meta:
        ordering = ["-created_datetime"]

class Comment(models.Model):
    user = models.ForeignKey(User, related_name='user_comment', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='post_comment',on_delete=models.CASCADE)
    comment = models.CharField(max_length=300)
    created_datetime = models.DateTimeField(auto_now_add=True)
    modified_datetime = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.comment[:10]
    class Meta:
        ordering = ["-created_datetime"]

class Like(models.Model):
    user = models.ForeignKey(User, related_name='user_like', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='post_like',on_delete=models.CASCADE)
    like = models.CharField(max_length=300)
    created_datetime = models.DateTimeField(auto_now_add=True)
    modified_datetime = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.like
    class Meta:
        ordering = ["-created_datetime"]
    
class Notification(models.Model):
    notification_content = models.CharField(max_length = 40) 
    sender = models.ForeignKey(User, related_name = "sender_notification", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name = "post_notification", on_delete=models.CASCADE, null=True, blank=True)
    receiver = models.ForeignKey(User, related_name = "receiver_notification", on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    notification_type = models.CharField(max_length = 40)
    created_datetime = models.DateTimeField(auto_now_add=True)
    modified_datetime = models.DateTimeField(auto_now=True) 
    
    class Meta:
        ordering = ('-created_datetime', )
    def __str__(self):
        return self.sender.username
    
    class Meta:
        ordering = ["-created_datetime"]
    

