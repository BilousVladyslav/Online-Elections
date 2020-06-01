from django.utils import timezone

from rest_framework.viewsets import ViewSet, ReadOnlyModelViewSet
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication

from votings_constructor.models import Voting, Question, Choice, Voter
from .serializers import VotingSerializer, VotesSerializer, QuestionResultSerializer, InactiveVotesSerializer
from .utils import get_questions


class VotesViewSet(ReadOnlyModelViewSet):

    permission_classes = [IsAuthenticated]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = VotesSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'vote_pk'

    def get_queryset(self):
        return Voting.objects.filter(voters__user=self.request.user,
                                     date_started__lt=timezone.now(),
                                     date_finished__gt=timezone.now())


class VoteSubmitAPIView(ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = VotingSerializer

    def get_queryset(self):
        return Voting.objects.filter(voters__user=self.request.user,
                                     date_started__lt=timezone.now(),
                                     date_finished__gt=timezone.now())

    def list(self, request, voting_vote_pk=None):
        voting = get_object_or_404(self.get_queryset(), id=voting_vote_pk)
        voter = Voter.objects.get(voting=voting, user=request.user)
        data = {
            'already_voted': voter.is_already_voted,
            'voting_date': voter.voting_date
        }
        if not voter.is_already_voted:
            data.update({
                'questions': get_questions(voting)
            })
        return Response(data)

    def create(self, request, voting_vote_pk=None):
        voting = get_object_or_404(self.get_queryset(), id=voting_vote_pk)
        serializer = VotingSerializer(data=request.data, context={'voting': voting, 'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class FinishedVotesAPIView(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = InactiveVotesSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'vote_pk'

    def get_queryset(self):
        return Voting.objects.filter(voters__user=self.request.user,
                                     date_finished__lt=timezone.now())


class ComingVotesAPIView(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = InactiveVotesSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'vote_pk'

    def get_queryset(self):
        return Voting.objects.filter(voters__user=self.request.user,
                                     date_started__gt=timezone.now())


class QuestionResultsViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    lookup_field = 'id'
    lookup_url_kwarg = 'vote_pk'

    def list(self, request, voting_vote_pk=None):
        queryset = Question.objects.filter(vote__voters__user=request.user,
                                           vote__date_finished__lte=timezone.now(),
                                           vote__id=voting_vote_pk)
        serializer = QuestionResultSerializer(queryset, many=True)
        return Response(serializer.data)
