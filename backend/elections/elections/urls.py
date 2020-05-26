from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views
from user_profile import views as user_views
from votings_constructor import views as construct_views
from rest_framework_nested.routers import DefaultRouter, NestedSimpleRouter

router = DefaultRouter()
router.register(r'constructor', construct_views.VotingCreatingViewSet, basename='votings')
vote_router = NestedSimpleRouter(router, r'constructor', lookup='voting')
vote_router.register(r'questions', construct_views.QuestionCreatingViewSet, basename='questions')
choice_router = NestedSimpleRouter(vote_router, r'questions', lookup='choice')
choice_router.register(r'choices', construct_views.ChoiceCreatingViewSet, basename='choices')


urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^', include(vote_router.urls)),
    url(r'^', include(choice_router.urls)),
    url(r'^api/profile/', user_views.UserProfile.as_view()),
    url(r'^api/profile/token-auth/', user_views.CustomAuthToken.as_view()),
    url(r'^api/profile/register/', user_views.RegistrationGenericView.as_view()),

    # url(r'^api/constructor/(?P<pk>\d*)$', construct_views.VotingCreatingGenericView.as_view()),
    # url(r'^api/constructor/question/(?P<pk_question>\d*)$', construct_views.QuestionCreatingGenericView.as_view()),

    # url(r'^api/voting/', user_views.RegistrationGenericView.as_view()),
]
