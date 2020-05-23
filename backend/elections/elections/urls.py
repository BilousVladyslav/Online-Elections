from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from rest_framework.authtoken import views
from user_profile import views as user_views


urlpatterns = [
    path('admin/', admin.site.urls),

    url(r'^api/profile/', user_views.UserProfile.as_view()),
    url(r'^api/profile/token-auth/', user_views.CustomAuthToken.as_view()),
    url(r'^api/profile/register/', user_views.RegistrationGenericView.as_view()),

    # url(r'^api/vote_constructor/', user_views.RegistrationGenericView.as_view()),

    # url(r'^api/voting/', user_views.RegistrationGenericView.as_view()),
]
