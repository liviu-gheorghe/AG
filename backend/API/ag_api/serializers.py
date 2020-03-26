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
        extra_kwargs = {'password': {'required': True}}

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user



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
            'date_posted',
        ]



class ProblemSolutionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemSolution
        fields = [
            'id',
            'problem',
            'author',
            'source_text',
            'source_type',
            'score',
            'date_posted',
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
            'author',
            'memory_limit',
            'time_limit',
            'source',
        ]


class ProblemMediumSerializer(serializers.ModelSerializer):
    author = UserSerializer(many=False)
    class Meta:
        model = Problem
        fields = [
            'id',
            'name',
            'description',
            'author',
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


