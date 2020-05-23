import uuid
from django.db import models
from django.conf import settings


class Voting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    voting_title = models.CharField(blank=False, max_length=200)
    voting_description = models.CharField(blank=False, max_length=1000)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_started = models.DateTimeField(blank=False)
    duration = models.DurationField(blank=False)


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    vote = models.ForeignKey(Voting, on_delete=models.CASCADE)
    question_text = models.CharField(blank=False, max_length=800)
    max_answers = models.IntegerField(default=1)


class Choice(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_test = models.CharField(blank=False, max_length=500)
    votes = models.IntegerField(default=0, editable=False)
