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
from django.http import HttpResponse,HttpResponseBadRequest
from django.shortcuts import get_object_or_404
import requests,json,subprocess,os,requests



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
            return Response(data={'detail':'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(data=serializer.data,status=status.HTTP_200_OK)



class LanguageViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()
    permission_classes = (AllowAny,)
    #authentication_classes = (TokenAuthentication,)


class ProblemTopicViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ProblemTopicSerializer
    queryset = ProblemTopic.objects.order_by('difficulty').all()
    permission_classes = (AllowAny,)



class ProblemViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ProblemSerializer
    queryset = Problem.objects.all()
    permission_classes = (AllowAny,)

    
    def get_serializer_class(self):
        #For the list view use the medium serializer 
        #because not all the info about the problem is 
        #required
        if self.action == 'list':
            return ProblemMediumSerializer
        #For the retrieve view use the normal serializer 
        #because all the info about the problem is needed
        elif self.action == 'retrieve':
            return ProblemSerializer



    def get_queryset(self,**kwargs):
        #print("Line 70 in views.py",self.request.GET,"\n"*3)
        #print("Line 71 in views.py", kwargs)

        #The url get parameters provided
        urlparams = self.request.GET
        if urlparams:
            if urlparams.get('id'):
                kwargs['id'] = urlparams['id']
            if urlparams.get('name'):
                kwargs['name__icontains'] = urlparams['name']
            if urlparams.get('tag'):
                kwargs['tags__icontains'] = urlparams.get('tag')
            if urlparams.get('difficulty'):
                kwargs['difficulty__in'] = urlparams.getlist('difficulty')
            if urlparams.get('topic'):
                kwargs['topic__name__in'] = urlparams.getlist('topic')


        # By default , get only the few first records
        index_start = 0
        index_end = 30
        if urlparams.get('start'):
            index_start = int(urlparams['start'])
        if urlparams.get('end'):
            index_end = int(urlparams['end'])
        #Slice the querydict only when listing
        if self.action == 'list':
            return Problem.objects.order_by('-datetime_posted').filter(**kwargs)[index_start:index_end]
        else:
             return Problem.objects.order_by('-id').filter(**kwargs)



class ProblemSolutionViewSet(viewsets.ReadOnlyModelViewSet):
    #Use the list serializer by default
    serializer_class = ProblemSolutionListSerializer
    #By default,the queryset is represented by all the objects 
    #in the database
    queryset = ProblemSolution.objects.all()
    permission_classes = (AllowAny,)
    #Get the serializer class according to the 
    #current action
    def get_serializer_class(self):
        #The list wiew should use the list serializer 
        #as not all the information about the problem 
        #solution is required
        if self.action == 'list':
            return ProblemSolutionListSerializer
        #The retrieve view should use the detail serializer 
        #as all the information about the problem solution is
        #required 
        elif self.action == 'retrieve':
            return ProblemSolutionDetailSerializer
    def get_queryset(self,**kwargs):
        print("Line 101 in views.py ",self.request.user.id)
        #The URL GET parameters provided in the request 
        #According to this urlparams
        #only specific records should be included in the 
        #queryset
        urlparams = self.request.GET
        #https://docs.djangoproject.com/en/3.0/ref/request-response/#querydict-objects
        #If any problem is specified,then add this constraint in
        #the filter's field lookups in order to return 
        #only the required records
        if urlparams.get('problem'):
            #Use Django's specific field lookup syntax
            kwargs['problem__in']  = urlparams.getlist('problem')

        #If any author is specified in the request's URL parameters,
        #then get the solutions posted by that user,else get the solutions 
        #posted by the authenticated user
        #If the intention is to get the solutions for the 
        #authenticated user, the frontend will make a request 
        #to this endpoint providing the auhor paramater as `self`
        if urlparams.get('author'):
            if urlparams.get('author') == 'self':
                kwargs['author'] = self.request.user.id
            else:
                kwargs['author__in'] = urlparams.getlist('author')

        if urlparams.get('latest'):
            pass
            #TODO

        #return the filtered queryset, showing the latest records first
        return ProblemSolution.objects.order_by('-datetime_posted').filter(**kwargs)

    #For a single solution, all we need to do is to 
    #get the solution according to the provided pk
    #and serialize it using the detail serializer 
    #(because on the frontend we will provide the user with 
    # all the necessary information about the solution)
    def retrieve(self,request,pk):
        #If the solution is not found a 404 status code 
        #should be provided in the returned http response
        obj=get_object_or_404(ProblemSolution,pk=pk)
        #Return the serialized data
        return Response(data=ProblemSolutionDetailSerializer(obj).data)




class LabViewSet(viewsets.ReadOnlyModelViewSet):
    queryset=Lab.objects.all()
    serializer_class =  LabSerializer   
    permission_classes = (AllowAny,)


class LabTaskChoicesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LabTaskChoices.objects.order_by('id').all()
    serializer_class = LabTaskChoicesSerializer
    permission_classes = (AllowAny,)
    def get_queryset(self, **kwargs):
        urlparams = self.request.GET
        if urlparams:
            if urlparams.get('lab'):
                kwargs['lab__id'] = urlparams['lab']

        return LabTaskChoices.objects.filter(**kwargs)


class TutorialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tutorial.objects.order_by('category').all()
    serializer_class = TutorialSerializer
    permission_classes = (AllowAny,)


class TutorialArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TutorialArticle.objects.all()
    serializer_class = TutorialArticleSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self,**kwargs):
        urlparams = self.request.GET
        if urlparams:
            if urlparams.get('tutorial'):
                kwargs['tutorial__id']=urlparams['tutorial']
        

        return TutorialArticle.objects.filter(**kwargs)


@api_view(['POST',])
@permission_classes([IsAuthenticated])
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
    #Convert the payload to json string and provide it to the POST 
    # request for the evaluation server
 
    EVALUATION_CONTAINER_HOST = os.getenv('EVALUATION_CONTAINER_HOST') or 'http://127.0.0.1:7000'


    json_payload = json.dumps(payload)
    evaluation_response = requests.post(
        EVALUATION_CONTAINER_HOST,
        data=json_payload
    ).json()


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
                

                '''
                print("DB test\n", test_list[iterator].std_output.replace(
                    '\r\n', '\n').strip(),"\n")
                print("Eval output \n",
                      evaluation_response[iterator]['stdout'].strip(),"\n")
                '''

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



    #print(payload['type_of_source'])
    #print("Line 200 ",request.user)

    #After the evaluation process,the solution should be automatically
    #added to the database
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
    #Create and save token object for token authentication
    token = Token.objects.create(user=new_user)
    token.save()
    #Create and save user profile
    userprofile = UserProfile.objects.create(user=new_user)
    userprofile.save()
    return HttpResponse()


def execute_sql(request):
    if request.method != 'POST':
        return HttpResponseBadRequest(
            "Method {} not allowed".format(request.method)
        )
    return HttpResponse("Execute SQL")
