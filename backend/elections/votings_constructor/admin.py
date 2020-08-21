from django.contrib import admin
from .models import Voter, Voting, Question, Choice

admin.site.register(Voter)
admin.site.register(Voting)
admin.site.register(Question)
admin.site.register(Choice)
# Register your models here.
