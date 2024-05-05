from django.core.cache import cache
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Post

@receiver(post_save, sender = Post)
def after_post_save(sender, instance, created, **kwargs):
    post_cache_key = "posts"
    if post_cache_key in cache:
        cache.delete(post_cache_key)
     