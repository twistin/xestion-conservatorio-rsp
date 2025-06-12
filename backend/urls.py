"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def root_welcome(request):
    return HttpResponse("<h2>Bienvenido al backend de Xestión Conservatorio</h2><p>API disponible en <a href='/api/'>/api/</a></p>")

urlpatterns = [
    path('', root_welcome),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
