# Generated by Django 3.0.3 on 2020-02-06 19:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ag_api', '0002_auto_20200206_2137'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='restrictions',
            field=models.TextField(blank=True, max_length=1024),
        ),
        migrations.AlterField(
            model_name='problem',
            name='source',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]
