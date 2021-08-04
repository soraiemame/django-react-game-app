from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializer import WordWolfRoomSerializer, CreateWordWolfRoomSerializer
from .models import WordWolfRoom


# Create your views here.


class WordWolfRoomView(generics.ListAPIView):
    queryset = WordWolfRoom.objects.all()
    serializer_class = WordWolfRoomSerializer


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
            room = WordWolfRoom(player_num=player_num, wolf_num=wolf_num)
            room.save()

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
                self.request.session['room_code'] = res.code
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

        if self.request.session.get('room_code') is None:
            return Response({'Bad request': 'You are not in the room'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            self.request.session['room_code'] = None
            return Response({'message': 'Successfully left the room'
                            .format(self.request.session.get('room_code'))}, status=status.HTTP_200_OK)
