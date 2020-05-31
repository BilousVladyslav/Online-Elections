from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator


class UserProfileSerializer(serializers.ModelSerializer):
    role = serializers.SlugRelatedField(read_only=True, slug_field='is_organizer')

    class Meta:
        model = get_user_model()
        fields = ['email', 'username', 'role', 'first_name', 'last_name']
        read_only_fields = ['email', 'username', 'role']


class RegisterUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['email', 'username', 'first_name', 'last_name', 'password']
        extra_kwargs = {'password': {'write_only': True,
                                     'min_length': 8},
                        'email': {'required': True,
                                  'validators': [UniqueValidator(queryset=get_user_model().objects.all())]},
                        'last_name': {'required': True},
                        'first_name': {'required': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        model = get_user_model()
        user = model(**validated_data)
        user.set_password(password)
        user.save()
        return user
