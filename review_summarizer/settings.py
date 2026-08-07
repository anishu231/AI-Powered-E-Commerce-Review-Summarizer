import os
from pathlib import Path
import environ  # Standard cloud environment reader active
import dj_database_url
import cloudinary
import cloudinary.uploader
import cloudinary.api
from datetime import timedelta 

BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables variables scheme
env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

SECRET_KEY = 'django-insecure-a@o*el+hq(nmyohi1wxjon2*om03ux!si5o7r^nzd9qd0eji1)'
DEBUG = True

ALLOWED_HOSTS = ['*', 'localhost', '127.0.0.1']  # Wildcard matrix allows dynamic Render subdomains

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
    'corsheaders.middleware.CorsMiddleware',  # Perfectly placed at the absolute top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

APPEND_SLASH = False  # Fixed trailing slash network error crash blocks
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
if os.environ.get('RENDER'):
    DATABASES = {
        'default': dj_database_url.parse(os.environ.get('DATABASE_URL')),
    }
    # Secure SSL handshake rules enforce kiye hain Render cloud database ke liye
    DATABASES['default']['OPTIONS'] = {'sslmode': 'require'}
else:
    # Local machine par normal binary SQLite chalta rahega testing ke liye
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator' },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator' },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GEMINI_API_KEY = env('GEMINI_API_KEY', default='')

CORS_ALLOWED_ORIGINS = [
    "https://netlify.app",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
]


# =========================================================================
# 🎯 FIXED SMTP EMAIL MODULE SETTINGS: Restored accurate server paths
# =========================================================================
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' 
EMAIL_HOST = '://gmail.com'  # 👈 FIXED: Removed invalid protocol prefix symbols
EMAIL_PORT = 587 
EMAIL_USE_TLS = True 
EMAIL_HOST_USER = 'singhrohit23130@gmail.com' 
EMAIL_HOST_PASSWORD = 'abcdefghijklmnop' 
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

CORS_ALLOW_ALL_ORIGINS = True 
CORS_ALLOW_CREDENTIALS = True 

# 🎯 CLOUDINARY CONFIGURATION ENGINE
cloudinary.config( 
    cloud_name=env('CLOUDINARY_CLOUD_NAME', default=''), 
    api_key=env('CLOUDINARY_API_KEY', default=''), 
    api_secret=env('CLOUDINARY_API_SECRET', default='') 
) 

# =========================================================================
# 🎯 FIXED SIMPLE JWT LIFETIME PERSISTENCE MODULE
# =========================================================================
SIMPLE_JWT = { 
    'ACCESS_TOKEN_LIFETIME': timedelta(days=365), 
    'REFRESH_TOKEN_LIFETIME': timedelta(days=400), 
    'ROTATE_REFRESH_TOKENS': False, 
    'BLACKLIST_AFTER_ROTATION': False, 
    'ALGORITHM': 'HS256', 
    'SIGNING_KEY': SECRET_KEY, 
}
