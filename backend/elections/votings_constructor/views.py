from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet, ViewSet
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework import mixins as rest_mixins

from .serializers import VotingConstructorSerializer, \
    QuestionConstructorSerializer, ChoiceConstructorSerializer, \
    VoterConstructorSerializer, VoterListConstructorSerializer
from .models import Voting, Question, Choice, Voter
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


class VotingCreatingViewSet(GenericViewSet,
                            rest_mixins.ListModelMixin,
                            rest_mixins.UpdateModelMixin,
                            rest_mixins.CreateModelMixin,
                            rest_mixins.DestroyModelMixin,
                            rest_mixins.RetrieveModelMixin):

    permission_classes = [IsAuthenticated, IsOrganizer]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = VotingConstructorSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'vote_pk'

    def get_queryset(self):
        return Voting.objects.filter(organizer=self.request.user,
                                     date_started__gt=timezone.now())

    def perform_create(self, serializer):
        return serializer.save(organizer=self.request.user)


class VoterCreatingViewSet(ViewSet, mixins.QuerysetModelMixin):

    permission_classes = [IsAuthenticated, IsOrganizer]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    lookup_field = 'id'
    lookup_url_kwarg = 'voter_pk'
    model = Voter

    def list(self, request, voter_vote_pk=None):
        queryset = self.get_queryset(voting=voter_vote_pk,
                                     voting__organizer=request.user,
                                     voting__date_started__gt=timezone.now())
        serializer = VoterListConstructorSerializer(queryset, many=True)
        return Response(serializer.data)

    def destroy(self, request, voter_pk=None, voter_vote_pk=None):
        voter = self.get_object(voter_pk,
                                voting=voter_vote_pk,
                                voting__organizer=request.user,
                                voting__date_started__gt=timezone.now())
        voter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def create(self, request, voter_vote_pk=None):
        print(request.data)
        queryset = Voting.objects.filter(organizer=self.request.user,
                                         date_started__gt=timezone.now())
        voting = get_object_or_404(queryset, pk=voter_vote_pk)

        serializer = VoterConstructorSerializer(data=request.data, context={'voting': voting})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionCreatingViewSet(ConstructorViewSet):

    serializer_class = QuestionConstructorSerializer
    lookup_url_kwarg = 'question_pk'
    model = Question
    parent_model = Voting
    parent_model_name = 'voting'

    def list(self, request, voting_vote_pk=None):
        return self.list_model(vote=voting_vote_pk,
                               vote__organizer=request.user,
                               vote__date_started__gt=timezone.now())

    def create(self, request, voting_vote_pk=None):
        print(request.data)
        return self.create_model(request, voting_vote_pk,
                                 organizer=request.user,
                                 date_started__gt=timezone.now())

    def retrieve(self, request, question_pk=None, voting_vote_pk=None):
        return self.retrieve_model(question_pk,
                                   vote=voting_vote_pk,
                                   vote__organizer=request.user,
                                   vote__date_started__gt=timezone.now())

    def update(self, request, question_pk=None, voting_vote_pk=None):
        return self.update_model(request, question_pk,
                                 vote=voting_vote_pk,
                                 vote__organizer=request.user,
                                 vote__date_started__gt=timezone.now())

    def destroy(self, request, question_pk=None, voting_vote_pk=None):
        return self.destroy_model(question_pk,
                                  vote=voting_vote_pk,
                                  vote__organizer=request.user,
                                  vote__date_started__gt=timezone.now())


class ChoiceCreatingViewSet(ConstructorViewSet):

    serializer_class = ChoiceConstructorSerializer
    lookup_url_kwarg = 'choice_pk'
    model = Choice
    parent_model = Question
    parent_model_name = 'question'

    def list(self, request, voting_vote_pk=None, choice_question_pk=None):
        return self.list_model(question=choice_question_pk,
                               question__vote=voting_vote_pk,
                               question__vote__organizer=request.user,
                               question__vote__date_started__gt=timezone.now())

    def create(self, request, voting_vote_pk=None, choice_question_pk=None):
        print(request.data)
        return self.create_model(request, choice_question_pk,
                                 vote=voting_vote_pk,
                                 vote__organizer=request.user,
                                 vote__date_started__gt=timezone.now())

    def retrieve(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        return self.retrieve_model(choice_pk,
                                   question=choice_question_pk,
                                   question__vote=voting_vote_pk,
                                   question__vote__organizer=request.user,
                                   question__vote__date_started__gt=timezone.now())

    def update(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        return self.update_model(request, choice_pk,
                                 question=choice_question_pk,
                                 question__vote=voting_vote_pk,
                                 question__vote__organizer=request.user,
                                 question__vote__date_started__gt=timezone.now())

    def destroy(self, request, choice_pk=None, voting_vote_pk=None, choice_question_pk=None):
        return self.destroy_model(choice_pk,
                                  question=choice_question_pk,
                                  question__vote=voting_vote_pk,
                                  question__vote__organizer=request.user,
                                  question__vote__date_started__gt=timezone.now())

