from django.urls import path
from .views import WordWolfRoomView, CreateWordWolfRoom, JoinWordWolfRoom, UserInWordWolfRoom, LeaveWordWolfRoom

urlpatterns = [
    path('word-wolf/rooms', WordWolfRoomView.as_view()),
    path('word-wolf/join', JoinWordWolfRoom.as_view()),
    path('word-wolf/user-in-room', UserInWordWolfRoom.as_view()),
    path('word-wolf/create', CreateWordWolfRoom.as_view()),
    path('word-wolf/leave', LeaveWordWolfRoom.as_view()),
]
