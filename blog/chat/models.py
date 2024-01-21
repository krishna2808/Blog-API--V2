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