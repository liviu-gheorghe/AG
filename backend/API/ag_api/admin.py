from django.contrib import admin
from .models import Snippet, Language,Problem,ProblemTest,User,UserProfile,ProblemSolution

#Model registration
admin.site.register(Snippet)
admin.site.register(Language)
admin.site.register(Problem)
admin.site.register(ProblemTest)
admin.site.register(UserProfile)
admin.site.register(ProblemSolution)
