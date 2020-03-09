from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import User, Language, Snippet, Problem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'required': True}}

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['name', 'default_snippet']




class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = [
            'id',
            'name',
            'description',
            'std_input',
            'std_output',
            'restrictions',
            'author',
            'memory_limit',
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
        ]



class ProblemSmallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = [
            'id',
            'name',
        ]
