from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import WordWolfRoomSerializer, CreateWordWolfRoomSerializer, WordWolfRoomSerializerAfterGame
from .models import WordWolfRoom
from .utils import generate_random_wolf, generate_random_theme


# Create your views here.


class WordWolfRoomView(generics.ListAPIView):
    queryset = WordWolfRoom.objects.all()
    serializer_class = WordWolfRoomSerializer


class GetRoom(APIView):
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = self.request.session.get('room_code')
        if code is not None:
            room = WordWolfRoom.objects.filter(code=code)
            if room.exists():
                if room[0].game_ended:
                    res = WordWolfRoomSerializerAfterGame(room[0]).data
                else:
                    res = WordWolfRoomSerializer(room[0]).data
                return Response(res, status=status.HTTP_200_OK)
            return Response({'Bad request': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad request': 'Code parameter not found'}, status=status.HTTP_400_BAD_REQUEST)


class CreateWordWolfRoom(APIView):
    serializer_class = CreateWordWolfRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if self.request.session.get('room_code') is not None:
            return Response({'Bad request': 'You have already joined in a room (Room code: {})'
                            .format(self.request.session.get('room_code'))})

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            player_num = serializer.data.get('player_num')
            wolf_num = serializer.data.get('wolf_num')
            wolf_theme, others_theme = generate_random_theme()
            room = WordWolfRoom(player_num=player_num, wolf_num=wolf_num, wolf_theme=wolf_theme, cur_num=1,
                                others_theme=others_theme, wolf=generate_random_wolf(player_num, wolf_num))
            room.save()

            # handle join
            self.request.session['room_code'] = room.code
            self.request.session['is_wolf'] = room.wolf & 1

            return Response(WordWolfRoomSerializer(room).data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response({'Error': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinWordWolfRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code is not None:
            room = WordWolfRoom.objects.filter(code=code)

            if room.exists():
                res = room[0]
                if res.cur_num == res.player_num:
                    return Response({'Room full': 'Room {} is full'.format(res.code)},
                                    status=status.HTTP_400_BAD_REQUEST)
                elif res.game_ended:
                    return Response({'Bad request': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
                else:
                    self.request.session['is_wolf'] = res.wolf >> res.cur_num & 1
                    self.request.session['room_code'] = res.code
                    res.cur_num += 1
                    res.save(update_fields=['cur_num'])
                    return Response({'message': 'successfully joined room: {}'.format(res.code)},
                                    status=status.HTTP_201_CREATED)
            else:
                return Response({'Bad request': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Bad request': 'Room code not found'}, status=status.HTTP_400_BAD_REQUEST)


class UserInWordWolfRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        return Response({'code': self.request.session.get('room_code')}, status=status.HTTP_200_OK)


class LeaveWordWolfRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = self.request.session.get('room_code')
        if code is None or not WordWolfRoom.objects.filter(code=code).exists():
            self.request.session['room_code'] = None
            self.request.session['is_wolf'] = None
            return Response({'Bad request': 'You are not in a room'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            room = WordWolfRoom.objects.filter(code=code)[0]
            if room.cur_num == room.player_num and not room.game_ended:
                return Response({'Game playing': 'You can not leave the room because the game is in progress'},
                                status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                self.request.session['room_code'] = None
                self.request.session['is_wolf'] = None
                room.cur_num -= 1
                room.save(update_fields=['cur_num'])
                if room.cur_num == 0:
                    room.delete()
                return Response({'message': 'Successfully left the room'
                                .format(self.request.session.get('room_code'))}, status=status.HTTP_200_OK)


class EndGame(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = self.request.session.get('room_code')
        if code is not None:
            rooms = WordWolfRoom.objects.filter(code=code)
            if rooms.exists():
                room = rooms[0]
                if room.game_ended:
                    return Response({'Bad request': 'Game already ended'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    room.game_ended = True
                    room.save(update_fields=['game_ended'])
                    return Response({'message': 'successfully ended the game'}, status=status.HTTP_200_OK)
            else:
                return Response({'Bad request': 'You are not in a room'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'Bad request': 'You are not in a room'}, status=status.HTTP_400_BAD_REQUEST)


class GetUsersTheme(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = self.request.session.get('room_code')
        if code is not None:
            rooms = WordWolfRoom.objects.filter(code=code)
            if rooms.exists():
                room = rooms[0]
                if self.request.session.get('is_wolf'):
                    res = room.wolf_theme
                else:
                    res = room.others_theme
                return Response({'theme': res}, status=status.HTTP_200_OK)
            else:
                return Response({'Bad request': 'You are not in a room'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad request': 'You are not in a room'}, status=status.HTTP_400_BAD_REQUEST)
