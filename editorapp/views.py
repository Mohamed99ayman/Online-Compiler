from django.shortcuts import render
from django.http import JsonResponse, HttpResponseForbidden,HttpResponse
from .forms import SnippetForm
from .models import Snippet
from django.shortcuts import render, redirect
import json 
import requests
import os


def index(request):
    if request.method == 'POST':
        form = SnippetForm(request.POST)
        if form.is_valid():
            form.save()
            
            f = open("code.cpp", "w")
           
            s=json.dumps(form.clean()).rstrip()
            s=s[10:]
            s=s[:-2]
            print(type(s))
            s = s.replace('\n', ' ').replace('\r', ' ')
            print(s)
            f.write(s)
            f.close()

            return redirect('/')
    else:
        form = SnippetForm()
    return render(request, "editorapp/template.html", {
        "form": form,
        "snippets": Snippet.objects.all()
    })
def home(request):
    return render(request,"editorapp/index.html")




def runcode(request):
    if request.is_ajax() and request.POST:
        source = request.POST['source']
        data = {
			'source': source,
		}
        f = open("code.cpp","w")
        f.write(source)
        f.close()
        os.system("g++ -Werror code.cpp 2>error.txt")
        compilation_error = open('error.txt', 'r').read()
        data=json.dumps(compilation_error)
        return HttpResponse(data,content_type='application/json')
    else:
        return HttpResponseForbidden()