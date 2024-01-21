from django.contrib import admin
from django.urls import path, include
from .views import * 
urlpatterns = [
    path('', PostCreateAndListAndUpdateDescostory.as_view(), name="post"),
    path('post-list/', PostList.as_view(), name="post-list"),
    path('user-post/', ShowUserPost.as_view(), name="user-post"),
    path('post-comment/', CommentAPI.as_view(), name="post-comment"),
    path('post-like/', LikeAPI.as_view(), name="post-like"),
    path('friend-request/', FriendRequestAPI.as_view(), name="friend-request"),
    path('notification/', NotificationAPI.as_view(), name="notification"),
    # path('own-post/', PostRetrieveAndUpdateAndDestory.as_view(), name="own-post"),
    # path('admin/', admin.site.urls),
    # path('', include("post.urls")),
	
]
