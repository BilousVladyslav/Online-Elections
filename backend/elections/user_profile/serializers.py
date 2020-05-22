from rest_framework import serializers
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SlugRelatedField(read_only=True, slug_field='is_organizer')

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'username', 'role']
