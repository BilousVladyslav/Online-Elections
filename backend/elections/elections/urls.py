from django.urls import path
from django.contrib import admin
from django.conf.urls import url

from votings.urls import voting_urlpatterns
from user_profile.urls import profile_urlpatterns
from votings_constructor.urls import constructor_urlpatterns


urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += profile_urlpatterns + constructor_urlpatterns + voting_urlpatterns
