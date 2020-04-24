from django.contrib import admin
from .models import *

#Model registration
admin.site.register(Snippet)
admin.site.register(Language)
admin.site.register(Problem)
admin.site.register(ProblemTest)
admin.site.register(UserProfile)
admin.site.register(ProblemSolution)
admin.site.register(ProblemTopic)
admin.site.register(Lab)
admin.site.register(LabTaskChoices)
admin.site.register(Tutorial)
admin.site.register(TutorialArticle)
