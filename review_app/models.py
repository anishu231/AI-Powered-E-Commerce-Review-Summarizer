from django.db import models 
from django.contrib.auth.models import User 
import uuid


def generate_order_number():
    return f"RP-{uuid.uuid4().hex[:10].upper()}"

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


class Order(models.Model):
    PAYMENT_CASH_ON_DELIVERY = "cod"
    PAYMENT_CHOICES = [(PAYMENT_CASH_ON_DELIVERY, "Cash on delivery")]

    STATUS_PENDING = "pending"
    STATUS_CHOICES = [(STATUS_PENDING, "Pending")]

    order_number = models.CharField(max_length=20, unique=True, default=generate_order_number)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="orders")
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=24)
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=12, choices=PAYMENT_CHOICES, default=PAYMENT_CASH_ON_DELIVERY)
    items = models.JSONField(default=list)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.order_number
