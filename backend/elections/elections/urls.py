from django.conf.urls import url
from django.contrib import admin
from django.urls import path
from rest_framework.authtoken import views
from user_profile import views as user_views


urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api-token-auth/', views.obtain_auth_token),
    url(r'^token-auth/', user_views.CustomAuthToken.as_view()),
    url(r'^register/', user_views.RegistrationGenericView.as_view()),
    url(r'^profile/', user_views.UserProfile.as_view()),
]
