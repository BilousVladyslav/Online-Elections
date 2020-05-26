from rest_framework import serializers
from rest_framework.authtoken.models import Token
from rest_framework.validators import UniqueValidator
from .models import Voting, Question, Choice


class ChoiceConstructorSerializer(serializers.ModelSerializer):
    question = serializers.SlugRelatedField(read_only=True, slug_field='id')

    class Meta:
        model = Choice
        fields = ['id', 'choice_text', 'question']

    def create(self, validated_data):
        choice = Choice(**validated_data, question=self.context['question'])
        choice.save()
        return choice


class QuestionConstructorSerializer(serializers.ModelSerializer):
    choices = ChoiceConstructorSerializer(many=True, read_only=True)
    vote = serializers.SlugRelatedField(read_only=True, slug_field='id')

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'max_answers', 'choices', 'vote']

    def create(self, validated_data):
        question = Question(**validated_data, vote=self.context['voting'])
        question.save()
        return question


class VotingConstructorSerializer(serializers.ModelSerializer):
    organizer = serializers.SlugRelatedField(read_only=True, slug_field='email')
    questions = serializers.SlugRelatedField(read_only=True, many=True, slug_field='id')

    class Meta:
        model = Voting
        fields = ['voting_title', 'voting_description', 'date_started', 'date_finished', 'organizer', 'questions']
        read_only_fields = ['questions']
