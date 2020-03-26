# Generated by Django 3.0.3 on 2020-03-19 20:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ag_api', '0010_auto_20200317_1615'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProblemSolution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_posted', models.DateTimeField(auto_now=True)),
                ('author', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('snippet', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='ag_api.Snippet')),
            ],
        ),
    ]