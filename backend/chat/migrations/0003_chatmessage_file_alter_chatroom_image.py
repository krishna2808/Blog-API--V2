# Generated by Django 4.0 on 2024-06-22 03:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_chatroom_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatmessage',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='chat_files/'),
        ),
        migrations.AlterField(
            model_name='chatroom',
            name='image',
            field=models.ImageField(blank=True, default='images/group_default.png', null=True, upload_to='images/account/2024-06-22 09:07:33.609200/'),
        ),
    ]
