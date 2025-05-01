from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser


def validate_token_and_get_user(request):
    """Utility function to validate token and return user object"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, Response({'error': 'Authorization header missing or invalid'},
                            status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        token = auth_header.split(' ')[1]
        decoded_token = AccessToken(token)
        user_id = decoded_token['user_id']
        user = CustomUser.objects.get(id=user_id)
        return user, None
    except Exception as e:
        return None, Response({'error': f'Invalid token: {str(e)}'},
                            status=status.HTTP_401_UNAUTHORIZED)