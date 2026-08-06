from django.db import models 
from django.contrib.auth.models import User 

# 1. PRODUCT MODEL (FIXED FOR CLOUDINARY URLS)
class Product(models.Model): 
    name = models.CharField(max_length=255) 
    slug = models.SlugField(unique=True, blank=True, null=True) 
    description = models.TextField() 
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    
    # 🎯 FIXED LAYER: Changed to CharField with max_length=500 
    # Is badlav se bada Cloudinary cloud production link database me bina crash ke permanent secure save ho sakega!
    image = models.CharField(max_length=500, blank=True, null=True) 
    
    review_summary = models.TextField(blank=True, null=True) 
    summary_updated_at = models.DateTimeField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self): 
        return self.name 


# 2. REVIEW MODEL
class Review(models.Model): 
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews') 
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    author = models.CharField(max_length=255) 
    rating = models.IntegerField() 
    comment = models.TextField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self): 
        return f"{self.author} - {self.rating}/5"
