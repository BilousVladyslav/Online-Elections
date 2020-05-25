from django.shortcuts import render
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, \
    UpdateModelMixin, DestroyModelMixin, ListModelMixin
from django.contrib.auth import get_user_model
from .serializers import VotingConstructorSerializer
from .models import Voting
from .permisions import IsOrganizer


class VotingCreatingGenericView(GenericAPIView, UpdateModelMixin, RetrieveModelMixin,
                                DestroyModelMixin, CreateModelMixin, ListModelMixin):
    permission_classes = [IsAuthenticated, IsOrganizer]
    authentication_classes = [BasicAuthentication, SessionAuthentication, TokenAuthentication]
    serializer_class = VotingConstructorSerializer

    lookup_field = 'id'

    def get_queryset(self):
        return Voting.objects.filter(organizer=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(organizer=self.request.user)

    def get(self, request, pk=None):
        if pk:
            return self.retrieve(request)
        else:
            return self.list(request)

    def put(self, request):
        return self.update(request)

    def delete(self, request):
        return self.destroy(request)

    def post(self, request):
        return self.create(request)
