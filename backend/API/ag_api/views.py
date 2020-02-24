from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserSerializer, LanguageSerializer, ProblemSerializer
from .models import User, Language, Problem,ProblemTest
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
import requests,json,subprocess,os

from .evaluator import execute as exc

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
    #converting the request body from bytestream to python object
    request_body_object = json.loads(
        request.body.decode('utf8').replace("'", '"'))


    request_body_object['time_limit']="1.00"


    response_list = []
    correct_tests_count = 0
    #Get only the first test in the test list
    test_list = ProblemTest.objects.all()[0:2]


    for iterator in range(len(test_list)):
        current_test_input = test_list[iterator].std_input
        request_body_object['stdin'] = current_test_input
        req = exc(request_body_object)
        if req['compilation_error']:
            message = {
                'status':req['compilation_error'],
                'time' : '0ms',
            }
        else:
            test_ok = (test_list[iterator].std_output.strip()
                    == req['stdout'].strip())
            if test_ok:
                correct_tests_count += 1
                message = {
                    'status': 'OK',
                    'time': req['time']
                }
            else:
                message = {
                    'status': 'Failed',
                    'time': req['time']
                }

        response_list.append(message)
    score = (correct_tests_count/len(test_list))*100
    score = int(score)
    print(score)
    return HttpResponse("{}".format({'tests': response_list, 'score': score}))
