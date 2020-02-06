from rest_framework import viewsets, status
from rest_framework.response import Response
#from rest_framework.decorators import action
from .serializers import UserSerializer, LanguageSerializer, ProblemSerializer
from .models import User, Language, Problem
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
#from rest_framework.decorators import api_view
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
import requests
import json


#Viewset used for user
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (AllowAny,)

    #Modifying or deleting a user is not allowed
    def destroy(self, request, *args, **kwargs):
        response = {'message': 'You are not allowed to remove users'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        response = {
            'message': 'You are not allowed to modify user credentials'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)




class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()
    permission_classes = (AllowAny,)

    #Only GET method is allowd

    def destroy(self, request, *args, **kwargs):
        response = {'message': 'Method not allowed'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        response = {
            'message': 'Method not allowed'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)

    def post(self, request, *args, **kwargs):
        response = {
            'message': 'Method not allowed'}
        return Response(response, status=status.HTTP_403_FORBIDDEN)


class ProblemViewSet(viewsets.ModelViewSet):
    serializer_class = ProblemSerializer
    queryset = Problem.objects.all()
    permission_classes = (AllowAny,)


'''
    Making a POST request on the glot API server in order to run 
    our code
    For more details on what glot is, check https://glot.io/
'''
# Mark the view as being exempt from the CSRF view protection.
@csrf_exempt
#Decorator to make a view only accept POST method
@require_http_methods(["POST", ])
def evaluate(request):
    #converting the request body from bytestream to json format
    request_body_json = json.loads(
        request.body.decode('utf8').replace("'", '"'))

    req = requests.post(
        'https://run.glot.io/languages/{}/latest'.format(
            request_body_json['type']),
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Token 3394bced-1f40-4b5e-adf8-4ad81d8738c1',
        },
        json={
            "stdin": request_body_json['std_input'],
            "files": [
                {
                    "name": request_body_json['name'],
                    "content": request_body_json['content'],
                }
            ]
        },
    )
    return HttpResponse(req.text)
