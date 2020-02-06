from django.contrib import admin
from .models import Snippet, Language

#Model registration
admin.site.register(Snippet)
admin.site.register(Language)
