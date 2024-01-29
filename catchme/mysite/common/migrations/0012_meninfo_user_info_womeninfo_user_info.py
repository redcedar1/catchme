# Generated by Django 4.2.3 on 2024-01-26 08:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0011_userinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='meninfo',
            name='user_info',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='common.userinfo'),
        ),
        migrations.AddField(
            model_name='womeninfo',
            name='user_info',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='common.userinfo'),
        ),
    ]