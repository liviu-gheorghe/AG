from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import *
from .models import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
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

    '''
    def get_serializer(self):
        print(self.request.__dict__,"\n"*3)

    '''
    def get_queryset(self):
        print(self.request.GET,"\n"*3),
        return Problem.objects.order_by('-id')
    


    permission_classes = (AllowAny,)
    def list(self, request):
        url_parameters = request.GET
        queryset = Problem.objects.order_by('-id').all()
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



class ProblemSolutionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProblemSolutionListSerializer
    queryset = ProblemSolution.objects.all()
    permission_classes = (IsAuthenticated,)



    def get_serializer_class(self):
        if self.action == 'list':
            return ProblemSolutionListSerializer
        elif self.action == 'retrieve':
            return ProblemSolutionDetailSerializer


    def get_queryset(self,**kwargs):

        print("Line 101 in views.py ",self.request.user.id)

        #The url get parameters provided 
        urlparams = self.request.GET

        #https://docs.djangoproject.com/en/3.0/ref/request-response/#querydict-objects

        #If any problem is specified
        if urlparams.get('problem'):
            kwargs['problem__in']  = urlparams.getlist('problem')

        #If any author is specified in the request then retrieve
        #the solutions for that user,else retrieve the solutions 
        #of the user that makes the request
        if urlparams.get('author'):
            kwargs['author__in'] = urlparams.getlist('author')
        else:
            kwargs['author'] = self.request.user.id
        
        if urlparams.get('latest'):
            pass

        print("Line 123 ",self.request.user.id)

        return ProblemSolution.objects.order_by('-date_posted').filter(**kwargs)


@api_view(['POST',])
@permission_classes([AllowAny])
def evaluate(request):
    #converting the request body from bytestream to python object
    payload = json.loads(
        request.body.decode('utf8').replace("'", '"'))
    response_list = []
    correct_tests_count = 0


    #Using backward relationship to get the test list for the current problem
    #https://docs.djangoproject.com/en/3.0/topics/db/queries/#following-relationships-backward
    test_list = Problem.objects.get(
        pk=payload['problem_id']).problemtest_set.all()
    input_sets = [test.std_input for test in test_list]
    payload['stdin'] = input_sets
    #The filename should have the same name as
    #the problem for which the user added the solution
    payload['filename'] = payload['problem_name']
    #Delete the problem name because it is stored in filename field
    del payload['problem_name']
    type_of_source = payload['type_of_source']
    evaluation_response = exc(payload, type_of_source)
    if 'compilation_error' in evaluation_response:
        message = {
            'compilation_error': evaluation_response['compilation_error'],
        }
        response_list.append(message)
    else:
        for iterator in range(len(evaluation_response)):
            if evaluation_response[iterator]['time'] == 'Time limit exceeded':
                message = {
                    'status': 'Depasit',
                    'time': '-'
                }
            else:
                message = {
                    'status': '',
                    'time': evaluation_response[iterator]['time'],
                    'stderr': evaluation_response[iterator]['stderr'],
                    'returncode': evaluation_response[iterator]['returncode']
                }
                #Check if the current result is correct i.e the strings are equal
                #The strings stored in the database contain an aditional carriage return
                # character, so \r\n must be replaced with \n
                test_ok = (test_list[iterator].std_output.replace('\r\n', '\n').strip()
                           == evaluation_response[iterator]['stdout'].strip())
                
                print("DB test\n", test_list[iterator].std_output.replace(
                    '\r\n', '\n').strip(),"\n")
                print("Eval output \n",
                      evaluation_response[iterator]['stdout'].strip(),"\n")

                if test_ok:
                    #Increment correct tests count
                    correct_tests_count += 1
                    message['status'] = 'OK'
                else:
                    message['status'] = 'Raspuns gresit'
            #Add current message to final response list
            response_list.append(message)

    #Compute the score obtained by the user with his solution
    #Note that the database contains at least one test for the 
    #problem so normally a division by zero would't occur
    #However, if the fetching of the tests related to the problem 
    #fails the test list will be empty, but that exception will be 
    #handled and the view will return immediately an http response
    #with 500(Interal Server Error) code
    score = (correct_tests_count/len(test_list))*100
    score = int(score)

    #After the evaluation process is computed,the solution should be automatically
    #added to the database



    print(payload['type_of_source'])
    print("Line 200 ",request.user)

    new_problem_solution = ProblemSolution.objects.create(
        problem = Problem.objects.get(pk=payload['problem_id']),
        author = request.user,
        source_text = payload['source_text'],
        source_type = payload['type_of_source'],
        score = score,
    )
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
    #Create abd save token object for token authentication
    token = Token.objects.create(user=new_user)
    token.save()
    #Create and save user profile
    userprofile = UserProfile.objects.create(user=new_user)
    userprofile.save()
    return HttpResponse()


