from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ViewSet
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, \
    UpdateModelMixin, DestroyModelMixin, ListModelMixin
from .serializers import VotingConstructorSerializer, QuestionConstructorSerializer, ChoiceConstructorSerializer
from .models import Voting, Question, Choice
from .permisions import IsOrganizer


class VotingCreatingViewSet(GenericViewSet, UpdateModelMixin, RetrieveModelMixin,
                            DestroyModelMixin, CreateModelMixin, ListModelMixin):

    permission_classes = [IsAuthenticated, IsOrganizer]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = VotingConstructorSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'vote_pk'

    def get_queryset(self):
        return Voting.objects.filter(organizer=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(organizer=self.request.user)


class QuestionCreatingViewSet(ViewSet):

    permission_classes = [IsAuthenticated, IsOrganizer]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = QuestionConstructorSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'question_pk'

    def list(self, request, voting_vote_pk=None):
        queryset = Question.objects.filter(vote=voting_vote_pk, vote__organizer=request.user)
        serializer = QuestionConstructorSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, voting_vote_pk=None):
        queryset = Voting.objects.filter(organizer=request.user)
        vote = get_object_or_404(queryset, pk=voting_vote_pk)

        serializer = QuestionConstructorSerializer(data=request.data, context={'voting': vote})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, question_pk=None, voting_vote_pk=None):
        queryset = Question.objects.filter(vote=voting_vote_pk, vote__organizer=request.user)
        question = get_object_or_404(queryset, pk=question_pk)

        serializer = QuestionConstructorSerializer(question)
        return Response(serializer.data)

    def update(self, request, question_pk=None, voting_vote_pk=None):
        queryset = Question.objects.filter(vote=voting_vote_pk, vote__organizer=request.user)
        question = get_object_or_404(queryset, pk=question_pk)
        serializer = QuestionConstructorSerializer(question, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, question_pk=None, voting_vote_pk=None):
        queryset = Question.objects.filter(vote=voting_vote_pk, vote__organizer=request.user)
        question = get_object_or_404(queryset, pk=question_pk)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ChoiceCreatingViewSet(ViewSet):

    permission_classes = [IsAuthenticated, IsOrganizer]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = ChoiceConstructorSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'choice_pk'

    def list(self, request, voting_vote_pk=None, choice_question_pk=None):
        queryset = Choice.objects.filter(question=choice_question_pk,
                                         question__vote=voting_vote_pk,
                                         question__vote__organizer=request.user)
        serializer = ChoiceConstructorSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, voting_vote_pk=None, choice_question_pk=None):
        queryset = Question.objects.filter(vote=voting_vote_pk,
                                           vote__organizer=request.user)
        question = get_object_or_404(queryset, pk=choice_question_pk)

        serializer = ChoiceConstructorSerializer(data=request.data, context={'question': question})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        queryset = Choice.objects.filter(question=choice_question_pk,
                                         question__vote=voting_vote_pk,
                                         question__vote__organizer=request.user)
        choice = get_object_or_404(queryset, pk=choice_pk)

        serializer = ChoiceConstructorSerializer(choice)
        return Response(serializer.data)

    def update(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        queryset = Choice.objects.filter(question=choice_question_pk,
                                         question__vote=voting_vote_pk,
                                         question__vote__organizer=request.user)
        choice = get_object_or_404(queryset, pk=choice_pk)

        serializer = ChoiceConstructorSerializer(choice, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        queryset = Choice.objects.filter(question=choice_question_pk,
                                         question__vote=voting_vote_pk,
                                         question__vote__organizer=request.user)
        choice = get_object_or_404(queryset, pk=choice_pk)
        choice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
