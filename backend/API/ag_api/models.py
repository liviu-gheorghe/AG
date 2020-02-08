from django.db import models
from django.contrib.auth.models import User


LANGUAGE_NAME_MAX_LEN = (1 << 4)
LANGUAGE_DESCRIPTION_MAX_LEN = (1 << 10)
SNIPPET_CONTENT_MAX_LEN = (1 << 16)


'''
Model used for representing code snippets
'''


class Snippet(models.Model):
    #The content of the snippet
    content = models.TextField(max_length=SNIPPET_CONTENT_MAX_LEN, null=True)
    #The language the snippet is written in
    snippet_type = models.CharField(
        max_length=LANGUAGE_NAME_MAX_LEN, null=True)
    '''
    Field used to identify those snippets that are default
    (the snippets used as samples for the text editor)
    The snippets that are not 'default' are loaded and saved(either private or public)
    by the users
    '''
    default = models.BooleanField(default=False)

    '''
    Field that specifies whether the snippet should be public 
    or private.
    By default,all snippets are public,including the default ones
    '''
    public = models.BooleanField(default=True)

    def __str__(self):
        if self.default:
            return "Default {}".format(self.snippet_type)
        else:
            return "{} source".format(self.snippet_type)


class Language(models.Model):
    '''
    Model used for storing programming language
    informations used for the text editor.
    For example,if the user chooses to write his
    program in a certaing langauge,the text editor should be
    able to provide a default snippet and, eventually,
    a little description of the language :D
    '''
    name = models.CharField(max_length=LANGUAGE_NAME_MAX_LEN, unique=True)
    description = models.TextField(
        max_length=LANGUAGE_DESCRIPTION_MAX_LEN, null=True)

    #Retreiving the content of the default snippet of the language

    def default_snippet(self):
        return Snippet.objects.get(snippet_type=self.name, default=True).content

    def __str__(self):
        return self.name


class Problem(models.Model):
    '''
    Model used for representing problems
    '''
    #Problem title
    name = models.CharField(max_length=(1 << 4))
    #Problem description
    description = models.TextField(max_length=(1 << 16))
    #Problem standard input description
    std_input = models.TextField(max_length=(1 << 10))
    #Problem standart output description
    std_output = models.TextField(max_length=(1 << 10))
    #Problem restrictions description
    restrictions = models.TextField(max_length=(1<<10),blank=True)
    '''
    Problem author 
    By default, if the author of the problem is removed from the 
    #database,the problems posted by him should not be deleted
    '''
    author = models.ForeignKey(User, models.PROTECT)
    #Memory limit constraint
    memory_limit = models.IntegerField(default=(1 << 4))
    #Time limit constraint
    time_limit = models.FloatField(default=0.5)
    #The source where the problem was retreived(if it does exist)
    #ex. CS Contensts
    source = models.CharField(max_length=(1 << 5), blank=True,null=True)


    def __str__(self):
        return "Problem {}".format(self.id)


class ProblemTest(models.Model):
    '''
    Model used for representing tests for the
    problems
    A test is basically a way to check whether
    the solution submitted by the user is valid
    or not

    Each problem has a default solution,that is
    written by the author of the problem.
    Based on the default solution,several tests are
    generated as follows:
    -> The input sets of the tests are generated automatically
    using a uniform randomization algorithm,based on the
    restrictions of the problem
    ->The default solution is executed for each input set
    and the output of the test is generated



    When a user submits his solution,
    it is executed using all
    input sets of the tests that belong to
    the problem.
    Each generated output set is compared
    to the corresponding test's output.
    If they match,the solution of the
    user is considered to be correct on
    that test


    The score of the solution is directely
    proportional with the ratio between
    the tests on which the solution is correct
    and the tests on which the solution is not
    correct.



    A test consists of an input, an output,
    and a releted problem(the problem
    that the test belongs to)

    '''
    std_input = models.TextField(max_length=(1<<10),null=True)
    std_output = models.TextField(max_length=(1<<16),null=True)
    #When the related problem is removed,its tests shold also
    #be removed
    related_problem = models.ForeignKey(to=Problem,on_delete=models.CASCADE,null=True)


    def __str__(self):
        return "Test for {}".format(self.related_problem)
