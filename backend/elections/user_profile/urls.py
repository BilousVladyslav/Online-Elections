from django.conf.urls import url

from .views import UserProfile, CustomAuthToken, RegistrationGenericView


profile_urlpatterns = [
    url(r'^api/profile/$', UserProfile.as_view()),
    url(r'^api/profile/token-auth/', CustomAuthToken.as_view()),
    url(r'^api/profile/register/', RegistrationGenericView.as_view()),
]