from django.conf.urls import url
from django.contrib import admin
from django.urls import path

from user_profile.urls import profile_urlpatterns
from votings_constructor.urls import constructor_urlpatterns
from votings.urls import voting_urlpatterns


urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += profile_urlpatterns + constructor_urlpatterns + voting_urlpatterns
