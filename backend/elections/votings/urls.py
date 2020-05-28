from django.conf.urls import url
from django.urls import include
from rest_framework_nested.routers import DefaultRouter, NestedSimpleRouter
from .views import VoteSubmitAPIView, VotesViewSet, QuestionResultsViewSet


votings_router = DefaultRouter()
votings_router.register(r'api/votings', VotesViewSet, basename='voting')

vote_submit_router = NestedSimpleRouter(votings_router, r'api/votings', lookup='voting')
vote_submit_router.register(r'vote', VoteSubmitAPIView, basename='vote')

voting_results_router = NestedSimpleRouter(votings_router, r'api/votings', lookup='voting')
voting_results_router.register(r'results', QuestionResultsViewSet, basename='results')


voting_urlpatterns = [
    url(r'^', include(votings_router.urls)),
    url(r'^', include(vote_submit_router.urls)),
    url(r'^', include(voting_results_router.urls)),
]