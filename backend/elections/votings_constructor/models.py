import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class Voting(models.Model):
    id = models.AutoField(primary_key=True)
    voting_title = models.CharField(blank=False, max_length=200)
    voting_description = models.CharField(blank=False, max_length=1000)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    date_started = models.DateTimeField(blank=False)
    date_finished = models.DateTimeField(blank=False)
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL,
                                  related_name='votings',
                                  on_delete=models.SET_NULL,
                                  editable=False,
                                  null=True)


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    vote = models.ForeignKey(Voting, related_name='questions', on_delete=models.CASCADE)
    question_text = models.CharField(blank=False, max_length=800)
    max_answers = models.IntegerField(default=1, validators=[MinValueValidator(1)])


class Choice(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    choice_text = models.CharField(blank=False, max_length=500)
    votes = models.PositiveIntegerField(default=0, editable=False)
