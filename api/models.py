from django.db import models
import random

# Create your models here.


def generate_word_wolf_code():
    while True:
        res = ""
        for _ in range(6):
            res += chr(random.randint(0, 25) + ord('A'))
        if not WordWolfRoom.objects.filter(code=res).exists():
            return res


class WordWolfRoom(models.Model):
    code = models.CharField(max_length=8, default=generate_word_wolf_code, unique=True)
    player_num = models.IntegerField(default=0)
    wolf_num = models.IntegerField(default=0)
    wolf_theme = models.CharField(max_length=50, default="")
    others_theme = models.CharField(max_length=50, default="")
    wolf = models.IntegerField(default=0)  # wolf bit
    cur_num = models.IntegerField(default=0)
    game_ended = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
