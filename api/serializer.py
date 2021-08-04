from rest_framework import serializers
from .models import WordWolfRoom


class WordWolfRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordWolfRoom
        fields = ('id', 'code', 'player_num', 'wolf_num', 'wolf_theme', 'others_theme', 'created_at')


class CreateWordWolfRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordWolfRoom
        fields = ('player_num', 'wolf_num')
