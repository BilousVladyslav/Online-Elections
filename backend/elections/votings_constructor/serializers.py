from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator
from .models import Voting, Question, Choice


class ChoiceConstructorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = ['choice_text']


class QuestionConstructorSerializer(serializers.ModelSerializer):
    choices = ChoiceConstructorSerializer(many=True)

    class Meta:
        model = Question
        fields = ['question_text', 'max_answers', 'choices']


class VotingConstructorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Voting
        fields = ['__all__']
        read_only_fields = ['id', 'date_created', 'organizer']
