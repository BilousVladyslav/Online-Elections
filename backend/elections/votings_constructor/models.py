from django.db import models
from django.conf import settings
from django.utils import timezone
from django.dispatch import receiver
from django.core.validators import MinValueValidator
from django.db.models.signals import post_save


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

    def vote(self):
        self.votes += 1


class Voter(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             related_name='voters',
                             on_delete=models.CASCADE,
                             editable=False)
    voting = models.ForeignKey(Voting,
                               related_name='voters',
                               on_delete=models.CASCADE,
                               editable=False)
    voting_date = models.DateTimeField(null=True, editable=False)
    is_already_voted = models.BooleanField(default=False, blank=False, editable=False)

    def vote(self):
        if not self.is_already_voted:
            self.voting_date = timezone.now()
            self.is_already_voted = True
            self.save()


@receiver(post_save, sender=Voting)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Voter.objects.create(user=instance.organizer, voting=instance)
