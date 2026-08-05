import os
from pathlib import Path
import environ  # django-environ import kiya gaya
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, '.env'))

env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = 'django-insecure-a@o*el+hq(nmyohi1wxjon2*om03ux!si5o7r^nzd9qd0eji1)'
DEBUG = True

ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']  # '*' lagane se Render ka dynamic URL automatic allow ho jayega

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'review_app',
    'seed',
    "rest_framework_simplejwt.token_blacklist",
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🎯 Top par perfectly aligned hai
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
APPEND_SLASH = False

ROOT_URLCONF = 'review_summarizer.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'review_summarizer.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GEMINI_API_KEY = env('GEMINI_API_KEY')

# =========================================================================
# 🎯 FIXED CORS INTEGRATION: Added your live Netlify domain address
# =========================================================================
CORS_ALLOWED_ORIGINS = [
    "https://netlify.app",  # 👈 Aapka live production website URL
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
]


# =========================================================================
# 🔥 AUTOMATED SMTP EMAIL MODULE SETTINGS
# =========================================================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = '://gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# 1. Apni real Gmail ID aur setting waala 16-letter App Password yahan safe add karein:
EMAIL_HOST_USER = 'singhrohit23130@gmail.com'  
EMAIL_HOST_PASSWORD = 'abcdefghijklmnop'  # 👈 Yahan apna 16-character ka Google app password bina spaces ke likhein

DEFAULT_FROM_EMAIL = 'ReviewPulse AI Team <singhrohit23130@gmail.com>'

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
}

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# settings.py ke sabse niche ye blocks re-verify karein
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

cloudinary.config(
    cloud_name=env('CLOUDINARY_CLOUD_NAME', default=''),
    api_key=env('CLOUDINARY_API_KEY', default=''),
    api_secret=env('CLOUDINARY_API_SECRET', default='')
)

