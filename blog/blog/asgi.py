"""
ASGI config for blog project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog.settings')




import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

from chat.routing import websocket_urlpatterns
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
import chat.routing

django_asgi_app = get_asgi_application()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": 
            URLRouter(
                websocket_urlpatterns
            )
    }
)

