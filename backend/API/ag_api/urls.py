from django.urls import path,include
from rest_framework import routers
from .views import UserViewSet, LanguageViewSet, ProblemViewSet, ProblemSolutionViewSet, ProblemTopicViewSet

router = routers.DefaultRouter()

router.register('users', UserViewSet)
router.register('languages', LanguageViewSet)
router.register('problems', ProblemViewSet)
router.register('problem_solutions',  ProblemSolutionViewSet)
router.register('problem_topics',  ProblemTopicViewSet)
urlpatterns = [
    path('',include(router.urls))
]
