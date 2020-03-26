# Generated by Django 3.0.3 on 2020-03-20 08:46

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ag_api', '0013_auto_20200320_1016'),
    ]

    operations = [
        migrations.AlterField(
            model_name='problem',
            name='memory_limit',
            field=models.FloatField(default=16, help_text='MB', validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(64)]),
        ),
    ]
