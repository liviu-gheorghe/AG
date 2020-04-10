# Generated by Django 3.0.3 on 2020-04-06 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ag_api', '0031_problem_topic'),
    ]

    operations = [
        migrations.CreateModel(
            name='Lab',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=64)),
                ('short_description', models.TextField(max_length=128)),
                ('description', models.TextField(max_length=65536)),
                ('category', models.TextField(max_length=32)),
            ],
        ),
    ]
