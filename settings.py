import os
from dotenv import load_dotenv
from mongoengine import connect
from decouple import config


load_dotenv()  # Load environment variables from .env file

# Connect to MongoDB using MongoEngine



DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DATABASE_NAME'),
        'USER': config('DATABASE_USER'),
        'PASSWORD': config('DATABASE_PASSWORD'),
        'HOST': config('DATABASE_HOST'),
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}


# ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='127.0.0.1,localhost').split(',')


# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(os.path.dirname(__file__), 'staticfiles')

# Media files (Uploaded files)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'media')

# Security settings
SECRET_KEY = os.getenv('SECRET_KEY', 'your-default-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

# Authentication settings
LOGIN_REDIRECT_URL = '/'  # Redirect to the homepage or any other desired URL
LOGOUT_REDIRECT_URL = '/'  # Redirect after logout

# Installed apps
INSTALLED_APPS = [
    'django.contrib.staticfiles',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.admin',
    'disease_detection', # Your app using MongoDB
    'rest_framework', 
    'rest_framework_simplejwt'
]

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(os.path.dirname(__file__), 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework_simplejwt.authentication.JWTAuthentication',
#     ),
#     'DEFAULT_PERMISSION_CLASSES': (
#         'rest_framework.permissions.IsAuthenticated',
#     ),
# }




REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}


# JWT Settings
# SIMPLE_JWT = {
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=20),
#     'REFRESH_TOKEN_LIFETIME': timedelta(days=1),

#     'AUTH_HEADER_TYPES': ('Bearer',),
#     'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
#     'USER_ID_FIELD': 'id',
#     'USER_ID_CLAIM': 'user_id',
#     'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',

#     'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
#     'TOKEN_TYPE_CLAIM': 'token_type',
#     'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',

#     'JTI_CLAIM': 'jti',

# }

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True
