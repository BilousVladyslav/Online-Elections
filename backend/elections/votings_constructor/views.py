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
from . import mixins


class ConstructorViewSet(ViewSet, mixins.QuerysetModelMixin,
                         mixins.CustomListModelMixin,
                         mixins.CustomRetrieveModelMixin,
                         mixins.CustomCreateModelMixin,
                         mixins.CustomUpdateModelMixin,
                         mixins.CustomDestroyModelMixin):
    permission_classes = [IsAuthenticated, IsOrganizer]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    lookup_field = 'id'


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


class QuestionCreatingViewSet(ConstructorViewSet):

    serializer_class = QuestionConstructorSerializer
    lookup_url_kwarg = 'question_pk'
    model = Question
    parent_model = Voting
    parent_model_name = 'voting'

    def list(self, request, voting_vote_pk=None):
        return self.list_model(vote=voting_vote_pk, vote__organizer=request.user)

    def create(self, request, voting_vote_pk=None):
        return self.create_model(request, voting_vote_pk,
                                 organizer=request.user)

    def retrieve(self, request, question_pk=None, voting_vote_pk=None):
        return self.retrieve_model(question_pk,
                                   vote=voting_vote_pk,
                                   vote__organizer=request.user)

    def update(self, request, question_pk=None, voting_vote_pk=None):
        return self.update_model(request, question_pk,
                                 vote=voting_vote_pk,
                                 vote__organizer=request.user)

    def destroy(self, request, question_pk=None, voting_vote_pk=None):
        return self.destroy_model(question_pk,
                                  vote=voting_vote_pk,
                                  vote__organizer=request.user)


class ChoiceCreatingViewSet(ConstructorViewSet):

    serializer_class = ChoiceConstructorSerializer
    lookup_url_kwarg = 'choice_pk'
    model = Choice
    parent_model = Question
    parent_model_name = 'question'

    def list(self, request, voting_vote_pk=None, choice_question_pk=None):
        return self.list_model(question=choice_question_pk,
                               question__vote=voting_vote_pk,
                               question__vote__organizer=request.user)

    def create(self, request, voting_vote_pk=None, choice_question_pk=None):
        return self.create_model(request, choice_question_pk,
                                 vote=voting_vote_pk,
                                 vote__organizer=request.user)

    def retrieve(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        return self.retrieve_model(choice_pk,
                                   question=choice_question_pk,
                                   question__vote=voting_vote_pk,
                                   question__vote__organizer=request.user)

    def update(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        return self.update_model(request, choice_pk,
                                 question=choice_question_pk,
                                 question__vote=voting_vote_pk,
                                 question__vote__organizer=request.user)

    def destroy(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        return self.destroy_model(choice_pk,
                                  question=choice_question_pk,
                                  question__vote=voting_vote_pk,
                                  question__vote__organizer=request.user)

