# Generated by Django 3.0.3 on 2020-04-09 18:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ag_api', '0035_labtaskchoices_lab'),
    ]

    operations = [
        migrations.AddField(
            model_name='labtaskchoices',
            name='indications',
            field=models.TextField(blank=True, max_length=1024),
        ),
        migrations.AddField(
            model_name='labtaskchoices',
            name='post_task_command',
            field=models.TextField(blank=True, max_length=1024),
        ),
        migrations.AddField(
            model_name='labtaskchoices',
            name='pre_task_command',
            field=models.TextField(blank=True, max_length=1024),
        ),
    ]