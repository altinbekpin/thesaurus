from django.urls import path

from . import views

urlpatterns = [
    
    path('', views.audio, name='audio_page'),
    path('audiohub/', views.audiohub, name='audiohub_page'),
    
]