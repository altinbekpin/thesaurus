from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.views import LoginView, LogoutView
from django.urls import reverse_lazy
from .forms import AuthUserForm, ProjectForm
from .models import Ontology
from django.core.files.storage import FileSystemStorage
from vectorhub.encoders.audio.tfhub import SpeechEmbedding2Vec
from django.http import JsonResponse
import rdflib

model = SpeechEmbedding2Vec()

def audio(request):
    
    template = 'audio.html'

    if request.method == 'POST':
        return HttpResponse(json)
    return render(request, template)
def audiohub(request):
    myfile = request.FILES['audio']
    fs = FileSystemStorage()
    filename = fs.save(myfile.name, myfile)
    
    sample = model.read(filename)
    vector = model.encode(sample)
    fs.delete(filename)
    result = {'status': 'ok'}
    
    result['embedding'] = vector


    if request.method == 'POST':
        return JsonResponse(result)
    return render(request, template)    
