import jwt
from channels.auth import AuthMiddlewareStack
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from account.models import User

# User = get_user_model()

@database_sync_to_async
def get_user(token):

    try:
        # Validate the token
        access_token = AccessToken(token)
    except TokenError:
        return AnonymousUser()

    try:
        # Extract payload from token
        payload = access_token.payload
        user_id = payload.get('user_id')
    except (jwt.ExpiredSignatureError, jwt.DecodeError, jwt.InvalidTokenError):
        return AnonymousUser()

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

    return user


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        
        headers = dict(scope["headers"])
        # print("headers ---------- ", headers)
        token_header = headers.get(b"authorization", None)

        if token_header:
            try:
                token_type, token = token_header.decode().split()
                if token_type.lower() == 'bearer':
                    scope["user"] = await get_user(token)
                else:
                    scope["user"] = AnonymousUser()
            except ValueError:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
