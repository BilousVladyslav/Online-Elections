from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import serializers

from .models import Voting, Question, Choice, Voter


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
        fields = ['id', 'voting_title', 'voting_description', 'date_started', 'date_finished', 'organizer', 'questions']
        read_only_fields = ['questions']


class VoterListConstructorSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(read_only=True, slug_field='email')
    voting = serializers.SlugRelatedField(read_only=True, slug_field='id')

    class Meta:
        model = Voter
        fields = ['id', 'user', 'voting']


class VoterConstructorSerializer(serializers.Serializer):
    user_email = serializers.EmailField()

    def validate_user_email(self, value):
        try:
            user = get_user_model().objects.get(email=value)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        try:
            voter = Voter.objects.get(user=user, voting=self.context['voting'])
        except ObjectDoesNotExist:
            return user
        raise serializers.ValidationError("Voter is already exist.")

    def create(self, validated_data):
        voter = Voter(user=validated_data['user_email'], voting=self.context['voting'])
        voter.save()
        return validated_data
