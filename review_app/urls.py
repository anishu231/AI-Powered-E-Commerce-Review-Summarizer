from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from review_app import views
from .views_auth import register, login
from .views_user import profile, logout

urlpatterns = [
    # Products API Wrap endpoint 
    path('products/', views.products_api_wrapper, name='products_api_wrapper'),
    path('products/<slug:slug>/', views.product_detail, name='product_detail'),
    path('products/<slug:slug>/generate-summary/', views.generate_reviews_summary, name='generate_reviews_summary'),
    path('products/<slug:slug>/review/', views.add_review, name='add_review'),
    
    
    path("api/auth/register/", register, name="register"),
    path("api/auth/login/", login, name="login"),
    path("api/auth/profile/", profile, name="profile"),
    path("api/auth/logout/", logout, name="logout"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/register/", views.register_user, name="register_user_fallback"), 
    path("auth/login/", login, name="login_fallback"),
]
