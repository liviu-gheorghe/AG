from django.contrib import admin
from .models import Snippet, Language,Problem,ProblemTest

#Model registration
admin.site.register(Snippet)
admin.site.register(Language)
admin.site.register(Problem)
admin.site.register(ProblemTest)
