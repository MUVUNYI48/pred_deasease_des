import os
from dotenv import load_dotenv
from decouple import config
from datetime import timedelta

load_dotenv()  # Load environment variables from .env file

# Build paths inside the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Security settings
SECRET_KEY = config('SECRET_KEY', default='your-secret-key')  # Keep your secret key secure
DEBUG = config('DEBUG', default=True, cast=bool)

# Allow hosts for local development
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    'disease_detection',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # ✅ Added DRF for API handling
    'rest_framework_simplejwt',  # ✅ Added Simple JWT for authentication
    'corsheaders',
]

# Authentication redirects
LOGIN_REDIRECT_URL = '/api/upload/'  
LOGOUT_REDIRECT_URL = '/login/'

# Middleware settings
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ✅ Ensure CORS middleware loads early
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tomato_ai.urls'

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "localhost:8000",  # ✅ Explicitly allow this for local API testing
]

# Template settings
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'tomato_ai.wsgi.application'

# PostgreSQL Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DATABASE_NAME', default='tomato_ai_db'),
        'USER': config('DATABASE_USER', default='neondb_owner'),
        'PASSWORD': config('DATABASE_PASSWORD', default='your-secure-password'),
        'HOST': config('DATABASE_HOST', default='your-database-host'),
        'PORT': config('DATABASE_PORT', default='5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ✅ Extended Token Expiration (JWT settings)
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=7),  # ✅ Access token lasts 7 days
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),  # ✅ Refresh token lasts 30 days
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Email configuration (for password reset & notifications)
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="smtp.your-email-provider.com")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=True, cast=bool)
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="your-email@example.com")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="your-email-password")

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = "smtp.your-email-provider.com"
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = "muvunyip48@gmail.com"  
# EMAIL_HOST_PASSWORD = "your-email-password"  


# Internationalization settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files settings
STATIC_URL = '/static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
























# import os
# from dotenv import load_dotenv
# from decouple import config

# load_dotenv()  # Load environment variables from .env file

# # Build paths inside the project
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# # Security settings
# SECRET_KEY = config('SECRET_KEY', default='your-secret-key')  # Keep your secret key secure
# DEBUG = config('DEBUG', default=True, cast=bool)

# # Allow hosts for local development
# ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# # Application definition
# INSTALLED_APPS = [
#     'disease_detection',
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'corsheaders',
# ]

# # Authentication redirects
# LOGIN_REDIRECT_URL = '/api/upload/'  
# LOGOUT_REDIRECT_URL = '/login/'

# # Middleware settings
# MIDDLEWARE = [
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'corsheaders.middleware.CorsMiddleware',  # CORS middleware needs to be early
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]

# ROOT_URLCONF = 'tomato_ai.urls'

# # CORS settings
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
# ]
# # ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1,localhost:8000').split(',')

# ALLOWED_HOSTS = [
#     "localhost",
#     "127.0.0.1",
#     "localhost:8000",  # Explicitly add this if needed
# ]


# # Template settings
# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]

# WSGI_APPLICATION = 'tomato_ai.wsgi.application'

# # PostgreSQL Database Configuration
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': config('DATABASE_NAME', default='tomato_ai_db'),
#         'USER': config('DATABASE_USER', default='neondb_owner'),
#         'PASSWORD': config('DATABASE_PASSWORD', default='your-secure-password'),
#         'HOST': config('DATABASE_HOST', default='your-database-host'),
#         'PORT': config('DATABASE_PORT', default='5432'),
#         'OPTIONS': {
#             'sslmode': 'require',
#         },
#     }
# }

# # Password validation
# AUTH_PASSWORD_VALIDATORS = [
#     {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
#     {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
# ]

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
# EMAIL_HOST = "smtp.your-email-provider.com"
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = "your-email@example.com"
# EMAIL_HOST_PASSWORD = "your-email-password"


# # Internationalization settings
# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True

# # Static files settings
# STATIC_URL = '/static/'

# # Default primary key field type
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
