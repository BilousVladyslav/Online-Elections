from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response


class QuerysetModelMixin:

    def get_queryset(self, *args, **kwargs):
        return self.model.objects.filter(**kwargs)

    def get_object(self, pk, **kwargs):
        queryset = self.get_queryset(**kwargs)
        return get_object_or_404(queryset, pk=pk)


class CustomListModelMixin:

    def list_model(self, *args, **kwargs):
        queryset = self.get_queryset(**kwargs)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class CustomRetrieveModelMixin:

    def retrieve_model(self, pk, **kwargs):
        model_obj = self.get_object(pk, **kwargs)
        serializer = self.serializer_class(model_obj)
        return Response(serializer.data)


class CustomCreateModelMixin:

    def create_model(self, request, pk, **kwargs):
        parent_obj_queryset = self.parent_model.objects.filter(**kwargs)
        parent_obj = get_object_or_404(parent_obj_queryset, pk=pk)

        serializer = self.serializer_class(data=request.data, context={self.parent_model_name: parent_obj})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CustomUpdateModelMixin:

    def update_model(self, request, pk, **kwargs):
        model_obj = self.get_object(pk, **kwargs)
        serializer = self.serializer_class(model_obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CustomDestroyModelMixin:

    def destroy_model(self, pk, **kwargs):
        model_obj = self.get_object(pk, **kwargs)
        model_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


