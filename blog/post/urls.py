from django.contrib import admin
from django.urls import path, include
from .views import * 
urlpatterns = [
    path('', PostCreateAndListAndUpdateDescostory.as_view(), name="post"),
    path('post-list/', PostList.as_view(), name="post-list"),
    path('user-profile/', UserProfileAPI.as_view(), name="user-profile"),
    path('post-comment/', CommentAPI.as_view(), name="post-comment"),
    path('post-like/', LikeAPI.as_view(), name="post-like"),
    path('friend-request/', FriendRequestAPI.as_view(), name="friend-request"),
    path('total-friend-request/', total_friend_request, name="total-friend-request"),
    path('notification/', NotificationAPI.as_view(), name="notification"),
    path('search_user/', SearchUser.as_view(), name = 'search_user'),
    
    # path('user-details/', UserDetailsAPI.as_view(), name="user-details"),
    path('fun/', fun, name="fun"),
    
    # path('own-post/', PostRetrieveAndUpdateAndDestory.as_view(), name="own-post"),
	
]
