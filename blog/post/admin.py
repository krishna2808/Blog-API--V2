from django.contrib import admin
from .models import *
# Register your models here.


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "file", "description")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("user", "post", "comment",)

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("sender", "post", "receiver", "notification_type", "created_datetime")