# Generated by Django 3.2.6 on 2021-08-04 10:35

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='WordWolfRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default=api.models.generate_word_wolf_code, max_length=8, unique=True)),
                ('player_num', models.IntegerField(default=0)),
                ('wolf_num', models.IntegerField(default=0)),
                ('wolf_theme', models.CharField(default='', max_length=50)),
                ('others_theme', models.CharField(default='', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
