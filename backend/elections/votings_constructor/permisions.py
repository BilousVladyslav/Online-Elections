from rest_framework import permissions


class IsOrganizer(permissions.BasePermission):
    message = "User is not allowed to organize votings."

    def has_permission(self, request, view):
        return request.user.role.is_organizer
