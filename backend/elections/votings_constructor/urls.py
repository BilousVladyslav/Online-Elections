from django.urls import include
from django.conf.urls import url

from rest_framework_nested.routers import DefaultRouter, NestedSimpleRouter

from .views import VotingCreatingViewSet, QuestionCreatingViewSet, ChoiceCreatingViewSet, VoterCreatingViewSet


router = DefaultRouter()
router.register(r'api/constructor', VotingCreatingViewSet, basename='votings')

vote_router = NestedSimpleRouter(router, r'api/constructor', lookup='voting')
vote_router.register(r'questions', QuestionCreatingViewSet, basename='questions')

choice_router = NestedSimpleRouter(vote_router, r'questions', lookup='choice')
choice_router.register(r'choices', ChoiceCreatingViewSet, basename='choices')

voters_router = NestedSimpleRouter(router, r'api/constructor', lookup='voter')
voters_router.register(r'voters', VoterCreatingViewSet, basename='voters')


constructor_urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^', include(voters_router.urls)),
    url(r'^', include(vote_router.urls)),
    url(r'^', include(choice_router.urls)),
]
