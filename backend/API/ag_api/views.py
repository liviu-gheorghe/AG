from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import UserSerializer, LanguageSerializer, ProblemSerializer, ProblemMediumSerializer, ProblemSmallSerializer
from .models import User, Language, Problem,ProblemTest
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
import requests,json,subprocess,os,requests
from .evaluator import execute as exc
#Viewset used for user
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (AllowAny,)


    def retrieve(self, request, *args, **kwargs):

        identifier_type = request.GET['identifier'] if request.GET and request.GET['identifier'] else 'id'

        try:
            if identifier_type == 'id':
                serializer = UserSerializer(User.objects.get(id=kwargs['pk']))
            elif identifier_type == 'username':
                serializer = UserSerializer(User.objects.get(username=kwargs['pk']))
        except:
            return Response(data={'detail':'Not found.'}, status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.data,status=status.HTTP_200_OK)



class LanguageViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()
    permission_classes = (AllowAny,)
    #authentication_classes = (TokenAuthentication,)


class ProblemViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ProblemSerializer
    queryset = Problem.objects.all()
    permission_classes = (AllowAny,)
    def list(self, request):
        url_parameters = request.GET
        queryset = Problem.objects.all()
        #print(url_parameters)
        if url_parameters and url_parameters['s_id']:
            serializer_type = url_parameters['s_id'][0]
            if serializer_type == '1':
                serializer = ProblemSerializer(queryset, many=True)
            elif serializer_type == '2':
                serializer = ProblemMediumSerializer(queryset, many=True)
            elif serializer_type == '3':
                serializer = ProblemSmallSerializer(queryset, many=True)
        else:
            serializer = ProblemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Mark the view as being exempt from the CSRF view protection.
@csrf_exempt
#Decorator to make a view only accept POST method
@require_http_methods(["POST", ])
def evaluate(request):
    #converting the request body from bytestream to python object
    request_body_object = json.loads(
        request.body.decode('utf8').replace("'", '"'))
    response_list = []
    correct_tests_count = 0

    #https://docs.djangoproject.com/en/3.0/topics/db/queries/#following-relationships-backward

    test_list = Problem.objects.get(pk=request_body_object['problem_id']).problemtest_set.all()
    request_body_object['time_limit'] = "1.00"
    input_sets = [test.std_input for test in test_list]
    request_body_object['stdin'] = input_sets
    source_type = request_body_object['type']
    req = exc(request_body_object,source_type)
    if 'compilation_error' in req:
        message = {
            'compilation_error': req['compilation_error'],
        }
        response_list.append(message)
    else:
        for iterator in range(len(req)):
            if req[iterator]['time'] == "Time limit exceeded":
                message = {
                    'status': 'Exceeded',
                    'time': '-'
                }
            else:
                '''
                print(req[iterator]['stdout'].strip().encode("utf-8"))
                print("-"*25)
                print(test_list[iterator].std_output.replace(
                    '\r\n', '\n').strip().encode("utf-8"))
                '''
                #Check if the current result is correct i.e the strings are equal
                #The strings stored in the database contain an aditional carriage return 
                # character, so \r\n must be replaced with \n
                test_ok = (test_list[iterator].std_output.replace('\r\n', '\n').strip()
                        == req[iterator]['stdout'].strip())
                if test_ok:
                    correct_tests_count += 1
                    message = {
                        'status': 'OK',
                        'time': req[iterator]['time']
                    }
                else:
                    message = {
                        'status': 'Failed',
                        'time': req[iterator]['time']
                    }

            response_list.append(message)
    score = (correct_tests_count/len(test_list))*100
    score = int(score)
    http_resp_json = json.dumps({'tests': response_list, 'score': score})
    return HttpResponse("{}".format(http_resp_json))


# Mark the view as being exempt from the CSRF view protection.
@csrf_exempt
#Decorator to make a view only accept POST method
@require_http_methods(["POST", ])
def verifyCaptchaView(request):
    #converting the request body from bytestream to python object
    payload = json.loads(
       request.body.decode('utf8').replace("'", '"'))
    CAPTCHA_SECRET_KEY = '6LeMYeEUAAAAAFzmejGzJY9tMcH0y6uLZN6Hzn7I'
    payload['secret'] = CAPTCHA_SECRET_KEY
    resp = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data=payload,
    )
    resp = resp.json()
    return HttpResponse(json.dumps({"success":resp['success']}))


# Mark the view as being exempt from the CSRF view protection.
@csrf_exempt
#Decorator to make a view only accept POST method
@require_http_methods(["POST", ])
def addUser(request):
    payload = json.loads(
        request.body.decode('utf8').replace("'", '"'))
    new_user  = User.objects.create_user(
        username=payload['username'],
        password=payload['password'],
        email=payload['email'],
        first_name=payload['first_name'],
        last_name=payload['last_name']
    );
    new_user.save()
    return HttpResponse("DA")

