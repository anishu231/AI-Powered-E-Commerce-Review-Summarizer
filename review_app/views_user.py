from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):

    return Response(
        {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):

    try:

        refresh_token = request.data.get("refresh")

        token = RefreshToken(refresh_token)

        token.blacklist()

        return Response(
            {
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK,
        )

    except Exception:

        return Response(
            {
                "error": "Invalid refresh token."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )