from django.urls import path,include
from rest_framework import routers
from .views import UserViewSet,LanguageViewSet,ProblemViewSet

router = routers.DefaultRouter()

router.register('users', UserViewSet)
router.register('languages', LanguageViewSet)
router.register('problems', ProblemViewSet)


urlpatterns = [
    path('',include(router.urls))
]
