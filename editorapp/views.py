from django.shortcuts import render
from django.http import JsonResponse, HttpResponseForbidden,HttpResponse
from django.shortcuts import render, redirect
import json 
import os
import subprocess
import sys



compiler={'CPP':'g++','JAVA':'javac','C':'gcc','Python':'python -m py_compile'}
code_extent={'CPP':'cpp','JAVA':'java','C':'c','Python':'py'}
outputcomp={'CPP':'./a.out','JAVA':'java TestClass ','C':'./a.out','Python':'python code.py'}

def home(request):
    return render(request,"editorapp/index.html")


def runcode(request):
    if request.is_ajax() and request.POST:
        # get input from request
        source = request.POST['source']
        inputtext=request.POST['input']
        language=request.POST['lang']
        data = {
			'source': source,
            'input':inputtext,
            'lang':language
		}
        if language=='JAVA' and source.find('class TestClass ')==-1:
            return HttpResponse(json.dumps("Class name chaged \nRename the class to TestClass"),content_type='application/json')
        cmd=""
        # check if there is input
        if inputtext:
            f=open("input.txt",'w')
            f.write(inputtext)
            f.close()
            cmd=" <input.txt"
        
        # create file to compile

        f = open("code."+code_extent[language],"w")
        f.write(source)
        f.close()
        compilation_error=""

        # try compiling the code
        try:
            subprocess.check_output(compiler[language]+" code."+code_extent[language], stderr=subprocess.PIPE,shell=True)
        except subprocess.CalledProcessError as e:
            compilation_error= e.stderr.decode(sys.getfilesystemencoding())

        if not compilation_error:
            p=subprocess.Popen(outputcomp[language]+cmd+" >out.txt",shell=True)
            try:
                p.wait(10)
            except subprocess.TimeoutExpired:
                p.kill()
                output="Process was terminated as it took longer than 10 seconds, was your code expecting an input?"
                data=json.dumps(output)
                return HttpResponse(data,content_type='application/json')
            output=open('out.txt','r').read()
            data=json.dumps(output)
            return HttpResponse(data,content_type='application/json')

        else :
            data=json.dumps(compilation_error)
            return HttpResponse(data,content_type='application/json')
    else:
        return HttpResponseForbidden()

            