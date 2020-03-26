# Generated by Django 3.0.3 on 2020-03-20 14:31

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ag_api', '0018_auto_20200320_1123'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problem',
            name='time_limit',
            field=models.FloatField(default=0.5, help_text='seconds', validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(5.0)]),
        ),
    ]