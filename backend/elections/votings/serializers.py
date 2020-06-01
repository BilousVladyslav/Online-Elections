from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from votings_constructor.models import Voting, Question, Choice, Voter

from .utils import get_questions


class VotesSerializer(serializers.ModelSerializer):
    organizer = serializers.SlugRelatedField(read_only=True, slug_field='email')
    questions = serializers.SlugRelatedField(read_only=True, many=True, slug_field='id')

    class Meta:
        model = Voting
        fields = ['id', 'voting_title', 'voting_description', 'date_started', 'date_finished', 'organizer', 'questions']


class InactiveVotesSerializer(serializers.ModelSerializer):
    organizer = serializers.SlugRelatedField(read_only=True, slug_field='email')

    class Meta:
        model = Voting
        fields = ['id', 'voting_title', 'voting_description', 'date_started', 'date_finished', 'organizer']


class ChoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = ['id', 'choice_text']


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    vote = serializers.SlugRelatedField(read_only=True, slug_field='id')

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'max_answers', 'choices', 'vote']


class VotingSerializer(serializers.Serializer):
    questions = serializers.DictField(child=serializers.ListField(child=serializers.IntegerField()),
                                      write_only=True,
                                      required=True)
    already_voted = serializers.BooleanField(read_only=True, default=False)
    voting_date = serializers.DateTimeField(allow_null=True, read_only=True)


    def validate_questions(self, value):
        queryset = Voter.objects.filter(voting=self.context['voting'])
        voter = get_object_or_404(queryset, user=self.context['request'].user)
        if voter.is_already_voted is True:
            raise serializers.ValidationError('User already voted!')

        all_questions = get_questions(self.context['voting'])
        for question, choices in value.items():
            if question in all_questions.keys():
                if len(choices) > all_questions[question]['max_answers']:
                    raise serializers.ValidationError(f"Too many answers for this question (id: {question}).")

                for choice in choices:
                    if choice not in all_questions[question]['choices']:
                        raise serializers.ValidationError(f"Choice (id: {choice}) does not exist for this voting.")
            else:
                raise serializers.ValidationError(f"Question (id: {question}) does not exist for this voting.")

        return value

    def save(self, raise_exception=False):
        voter = Voter.objects.get(user=self.context['request'].user, voting=self.context['voting'])

        choices_id = [choice for choices in self.validated_data['questions'].values() for choice in choices]
        for choice_id in choices_id:
            Choice.objects.get(id=choice_id).vote()
        voter.vote()
        self.validated_data['already_voted'] = voter.is_already_voted
        self.validated_data['voting_date'] = voter.voting_date


class ChoiceResultsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = ['id', 'choice_text', 'votes']


class QuestionResultSerializer(serializers.ModelSerializer):
    choices = ChoiceResultsSerializer(many=True, read_only=True)
    vote = serializers.SlugRelatedField(read_only=True, slug_field='id')

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'max_answers', 'choices', 'vote']

