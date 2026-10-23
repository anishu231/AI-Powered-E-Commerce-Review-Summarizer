from rest_framework import serializers
from .models import Product, Review
from django.contrib.auth.models import User

# 1. REVIEW CARD GRID SERIALIZER
class ReviewSerializer(serializers.ModelSerializer):
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'author', 'rating', 'comment', 'created_at']

    def get_created_at(self, obj):
        # Screenshot design ke mutabik date formatting ('Jul 25, 2026')
        return obj.created_at.strftime("%b %d, %Y")


# 2. HOME PAGE CATALOG SERIALIZER (FIXED CLOUDINARY INTEGRATION)
class ListProductSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()
    image_gallery = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'slug', 'description', 'price', 'image', 'imageUrl', 'image_gallery', 'created_at', 'review_summary']

    def get_imageUrl(self, obj):
        if obj.image:
            image_str = str(obj.image)
            # 🎯 FIX: Agar link pehle se cloud URL hai, toh bina chhede direct return karega
            if image_str.startswith('http://') or image_str.startswith('https://'):
                return image_str
            # Local reference fallback layer
            return obj.image.url
        return ""

    def get_image_gallery(self, obj):
        urls = list(obj.gallery_images or [])
        if obj.image and obj.image not in urls:
            urls.insert(0, obj.image)
        return [
            {"url": url, "is_primary": url == obj.image}
            for url in urls
        ]


# 3. DETAIL PAGE COMPLETE GRAPH SERIALIZER (FIXED CLOUDINARY INTEGRATION)
class ProductDetailSerializer(serializers.ModelSerializer):
    imageUrl = serializers.SerializerMethodField()
    image_gallery = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True) # Direct mapping for real-time reviews array

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'image', 'imageUrl', 'image_gallery',
            'created_at', 'reviews', 'review_summary', 'summary_updated_at'
        ]

    def get_imageUrl(self, obj):
        if obj.image:
            image_str = str(obj.image)
            # 🎯 FIX: Detail page ke liye bhi clean cloud URL enforcement logic active kiya
            if image_str.startswith('http://') or image_str.startswith('https://'):
                return image_str
            return obj.image.url
        return ""

    def get_image_gallery(self, obj):
        urls = list(obj.gallery_images or [])
        if obj.image and obj.image not in urls:
            urls.insert(0, obj.image)
        return [
            {"url": url, "is_primary": url == obj.image}
            for url in urls
        ]
