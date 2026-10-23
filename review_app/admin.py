from django.contrib import admin
from .models import Order, Product, Review


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "full_name", "phone", "total_amount", "status", "created_at")
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("order_number", "full_name", "email", "phone")
    readonly_fields = ("order_number", "items", "total_amount", "created_at")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "price",
        "slug",
        "summary_updated_at",
    )
    list_filter = ("summary_updated_at",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("summary_updated_at",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "rating",
        "author",
        "created_at",
    )
    list_filter = ("rating", "created_at")
    search_fields = ("product__name", "comment", "author")
    readonly_fields = ("created_at",)
