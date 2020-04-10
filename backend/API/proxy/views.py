from django.shortcuts import render
from django.http import HttpResponse,HttpResponseBadRequest
# Create your views here.


print("Something is happening")


def redirect_request(request):
    if(request.method != "GET"):
        return HttpResponseBadRequest("BAD REQUEST")
    #print(request)
    return HttpResponse("DA")