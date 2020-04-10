from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import *


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'description',
            'interests',
            'profile_image',
            'social_media_links',
        ]


class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(many=False)
    class Meta:
        model = User
        fields = [
        'id',
        'username',
        'first_name',
        'last_name',
        'last_login',
        'userprofile',
        ]

class UserSmallSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
        ]





class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['name', 'default_snippet']



class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = [
            'content',
            'public',
        ]


class ProblemTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemTopic
        fields = [
        'name', 
        'description',
        'difficulty', 
        'problems_available_count'
        ]

class ProblemSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False)
    class Meta:
        model = Problem
        fields = [
            'id',
            'name',
            'description',
            'std_input',
            'std_output',
            'restrictions',
            'tags',
            'difficulty',
            'level',
            'date_posted',
            'author',
            'memory_limit',
            'explanations_and_indications',
            'time_limit',
            'source',
        ]


class ProblemMediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = [
            'id',
            'name',
            'description',
            'difficulty',
            'level',
            'author',
            'date_posted',
            'time_posted',
            'is_recent',
            'is_recent_date_posted',
            'tags',
        ]



class ProblemSmallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = [
            'id',
            'name',
            'tags',
        ]

class ProblemDetailsSerializer(serializers.ModelSerializer):
    author = UserSmallSerializer(many=False)
    class Meta:
        model = Problem
        fields = [
            'id',
            'name',
            'tags',
            'difficulty',
            'level',
            'date_posted',
            'author',
            'memory_limit',
            'time_limit',
            'source',
        ]


#Serializer used for listing problem solution
class ProblemSolutionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemSolution
        fields = [
            'id',
            'problem',
            'author',
            'source_type',
            'score',
            'datetime_posted',
            'date_posted',
            'time_posted',
            'is_recent',
            'is_recent_date_posted'
        ]


class ProblemSolutionDetailSerializer(serializers.ModelSerializer):
    problem = ProblemDetailsSerializer(many=False)
    author = UserSmallSerializer(many=False)
    class Meta:
        model = ProblemSolution
        fields = [
            'id',
            'problem',
            'author',
            'source_text',
            'source_type',
            'score',
            'datetime_posted',      
            'date_posted',
            'time_posted',
            'is_recent',
            'is_recent_date_posted'
        ]




class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = '__all__'


class LabTaskChoicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTaskChoices
        fields = '__all__'