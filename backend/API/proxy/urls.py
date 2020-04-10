from django.urls import path
from .views import redirect_request

urlpatterns = [
    path('redirect/',redirect_request)
]