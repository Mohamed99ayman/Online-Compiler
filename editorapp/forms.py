from .models import Snippet
from django import forms
from django_ace import AceWidget


class SnippetForm(forms.ModelForm):
    class Meta:
        model = Snippet
        widgets = {
            "text": AceWidget(mode='c_cpp', theme='twilight',
            wordwrap=True,
        width="500px",
        height="300px",
        minlines=None,
        maxlines=None,
        showprintmargin=False,
        showinvisibles=False,
        usesofttabs=True,
        tabsize=True,
        fontsize=None,
        toolbar=True),
        }
        exclude = ()