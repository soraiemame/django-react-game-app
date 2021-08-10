from django.urls import path
from .views import index

app_name = 'frontend'

urlpatterns = [
    path('', index),
    path('word-wolf/join/', index),
    path('word-wolf/create/', index),
    path('word-wolf/room/<str:code>', index),
]
