from django.contrib import admin
from .models import * 
# Register your models here.

admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("user", "message", "created_datetime",)

admin.site.register(ChatRoom)
admin.site.register(ChatMessage)
