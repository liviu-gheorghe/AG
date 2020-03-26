from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator,MaxValueValidator

LANGUAGE_NAME_MAX_LEN = (1 << 4)
LANGUAGE_DESCRIPTION_MAX_LEN = (1 << 10)
SNIPPET_CONTENT_MAX_LEN = (1 << 16)


AVAILABLE_LANGUAGES = [
    ('c++', 'C++'),
    ('java', 'Java'),
    ('python', 'Python'),
    ('javascript', 'Javascript'),
    ('perl', 'Perl'),
    ('ruby', 'Ruby'),
    ('haskell', 'Haskell'),
    ('go', 'Go'),
    ('erlang', 'Erlang'),
    ('c#', 'C#'),
    ('bash', 'Bash'),
    ('php', 'PHP'),
    ('c', 'C'),
    ('objective-c', 'Objective-C'),
]




class UserProfile(models.Model):
    '''
    Model used for representing addditional 
    user information
    This informations could also have been
    stored in the user model itself,but in
    this way we keep the User model simpler
    and separate the additional information 
    that has nothing to do with the authentication 
    process
    '''

    #Construct file path for profile image
    def construct_path(self,filename):
        return "static/uploads/user/{}/{}".format(self.user.username,filename)

    #The user the info belongs to
    #When the user is deleted, his profile shound also 
    #be deleted from the database
    user = models.OneToOneField(to=User,on_delete=models.CASCADE)
    #description
    description = models.TextField(max_length=(1<<10),blank=True)
    #interests
    interests = models.TextField(max_length=(1 << 10), blank=True)
    #profile image
    profile_image = models.ImageField(blank=True, upload_to=construct_path)
    #social media links
    social_media_links = models.TextField(max_length=(1 << 6), blank=True)


    def __str__(self):
        return '{}\'s Profile'.format(self.user.__str__())


class Snippet(models.Model):
    '''
    Model used for representing code snippets
    '''
    #https://docs.djangoproject.com/en/3.0/ref/models/fields/
    #The content of the snippet
    content = models.TextField(
        max_length=SNIPPET_CONTENT_MAX_LEN,
         null=True
    )
    #The language the snippet is written in
    snippet_type = models.CharField(
        max_length=LANGUAGE_NAME_MAX_LEN, 
        null=True,
        choices=AVAILABLE_LANGUAGES,
    )
    '''
    Field used to identify those snippets that are default
    (the snippets used as samples for the text editor)
    The snippets that are not 'default' are loaded and
    saved(either private or public)
    by the users
    '''
    default = models.BooleanField(default=False)
    '''
    Field that specifies whether the snippet should be public 
    or private.
    For example, a snippet that is integrated in a tutorial 
    or a lesson should be available for everyone,
    including non-logged users
    By default,all snippets are public,including the default ones
    '''
    public = models.BooleanField(default=True)

    def __str__(self):
        if self.default:
            return "Default {}".format(self.snippet_type)
        else:
            if hasattr(self,"problemsolution") is False:
                return "{} source".format(self.snippet_type)
            else:
                return "{} source {}".format(self.snippet_type,self.problemsolution)


class Language(models.Model):
    '''
    Model used for storing programming language
    informations used for the text editor.
    For example,if the user chooses to write his
    program in a certaing langauge,the text editor should be
    able to provide a default snippet and, eventually,
    a little description of the language :D
    '''

    name = models.CharField(
        max_length=LANGUAGE_NAME_MAX_LEN,
        unique=True,
        choices=AVAILABLE_LANGUAGES,
    )
    description = models.TextField(
        max_length=LANGUAGE_DESCRIPTION_MAX_LEN,
         null=True
    )

    #Retreiving the content of the default snippet of the language

    def default_snippet(self):
        return Snippet.objects.get(
                    snippet_type=self.name,
                    default=True
                ).content

    def __str__(self):
        return self.name


class Problem(models.Model):
    '''
    Model used for representing problems
    '''

    FIELD_MAX_LEN = {
        'name' : (1<<5),
        'description' : (1<<16),
        'std_input' : (1<<10),
        'std_output' : (1<<10),
        'restrictions' : (1<<10),
        'tags' : (1<<10),
        'source' : (1<<6),
    }

    #Problem title
    name = models.CharField(
        max_length=FIELD_MAX_LEN['name']
    )

    #Problem description
    description = models.TextField(
        max_length=FIELD_MAX_LEN['description']
    )

    #Problem standard input description
    std_input = models.TextField(
        max_length=FIELD_MAX_LEN['std_input']
    )

    #Problem standart output description
    std_output = models.TextField(
        max_length=FIELD_MAX_LEN['std_output']
    )

    #Problem restrictions description
    restrictions = models.TextField(
        max_length=FIELD_MAX_LEN['restrictions'],
        blank=True
    )

    #Tags for the problem
    tags  = models.TextField(
        max_length=FIELD_MAX_LEN['source'],
        blank=True
    )
    '''
    Problem author 
    By default, if the author of the problem is removed from the 
    #database,the problems posted by him should not be deleted
    '''
    author = models.ForeignKey(
        User,
        models.SET_NULL,
        null=True
    )

    #Memory limit constraint
    #The default memory limit 
    #is 16(MB)
    memory_limit = models.FloatField(
        default=(1 << 4),
        validators=[
            MinValueValidator(0.00),
            MaxValueValidator(64.00)
        ],
        help_text='MB'
    )

    #Time limit constraint
    time_limit = models.FloatField(
        default=0.5,
        validators=[
            MinValueValidator(0.00),
            MaxValueValidator(5.00)
        ],
        help_text='seconds'
    )
    
    #The source where the problem was retreived(if it does exist)
    #ex. CS Contensts
    source = models.CharField(
        max_length=FIELD_MAX_LEN['source'],
        blank=True,
        null=True
    )


    def __str__(self):
        return self.name


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
    std_input = models.TextField(
        max_length=(1<<10),
        null=True
    )

    std_output = models.TextField(
        max_length=(1<<16),
        null=True
    )
    #When the related problem is removed,its tests shold also
    #be removed
    related_problem = models.ForeignKey(
        to=Problem,
        on_delete=models.CASCADE,
        null=True
    )
    def __str__(self):
        return "Test for {}".format(self.related_problem)



class ProblemSolution(models.Model):
    #Related problem
    #When the related problem is 
    #removed, the solutions of that 
    #problem should be also removed
    problem = models.ForeignKey(
        to=Problem,
        on_delete=models.CASCADE,
        null=True
    )
    #Solution author
    #When the author of the problem
    #is removed, all of his solutions should be
    #also removed from the database
    author = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE
    )
    #The actual source code of the solution
    source_text = models.TextField(
        max_length=(1<<16),
        null=True,
    )
    #Additional information for the source(optional)
    source_description = models.TextField(
        max_length=(1<<16),
        null=True,
    )
    #The type of source i.e the language the 
    #source is written in
    source_type = models.CharField(
        max_length = (1<<4),
        choices = AVAILABLE_LANGUAGES,
        null=True,
    )
    #Boolean field that states whether 
    #the solution should be public or not
    #By default, all problem solutions are
    #public
    public = models.BooleanField(
        default = True,
    )

    #The score obtained with the solution
    #based on the evaluation process
    score = models.IntegerField(
        validators = [
            MinValueValidator(0.00),
            MaxValueValidator(100.00),
        ],
        null=True
    )
    #The time when the solution is posted,
    #automatically set to the time when
    #the users uploads the solution
    date_posted = models.DateTimeField(auto_now=True)


    def __str__(self):
        return "{} {}".format(
            self.author,
            self.date_posted.strftime(
                "on %d/%m/%Y at %H:%M:%S"
            )
        )
