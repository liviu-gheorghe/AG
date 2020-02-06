from django.urls import path,include
from rest_framework import routers
from .views import UserViewSet,LanguageViewSet

router = routers.DefaultRouter()

router.register('users', UserViewSet)
router.register('languages', LanguageViewSet)

urlpatterns = [
    path('',include(router.urls))
]