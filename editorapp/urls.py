from django.urls import path

from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    path('',views.home),
    path('run/',views.runcode),
]
