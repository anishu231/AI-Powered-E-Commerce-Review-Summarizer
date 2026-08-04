# """
# URL configuration for review_summarizer project.

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/5.2/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """
# # from django.contrib import admin
# # from django.urls import include, path

# # urlpatterns = [
# #     path('admin/', admin.site.urls),
# #     path('api/', include('review_app.urls')),   
# # ]
# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static # Static files static handlers core modules

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('review_app.urls')), # Aapka existing app configurations route
# ]

# # 🔥 MOST IMPORTANT: Yeh code Django ko batata hai ki uploaded images browser me kaise open karein
# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # 🎯 FIXED ADMIN ROUTE: Changed to standard callable instance to resolve Render crash completely
    path('admin/', admin.site.urls), 
    
    # 🎯 GATEWAY ROUTE: Frontend ke saare API network calls automatically app folder path se sync ho jayenge
    path('api/', include('review_app.urls')),
    path('', include('review_app.urls')), # Secure configuration fallback trace link
]

# Media urls handler loop for high-res webp compressed uploaded products layout feeds
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

