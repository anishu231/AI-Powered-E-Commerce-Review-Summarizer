from decimal import Decimal

from django.db import transaction
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Order, Product


class OrderLineInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=99)


class OrderCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=120, trim_whitespace=True)
    email = serializers.EmailField()
    phone = serializers.RegexField(regex=r"^\+?[0-9()\-\s]{7,24}$", max_length=24)
    address = serializers.CharField(max_length=1000, trim_whitespace=True)
    city = serializers.CharField(max_length=100, trim_whitespace=True)
    postal_code = serializers.CharField(max_length=20, trim_whitespace=True)
    payment_method = serializers.ChoiceField(choices=[Order.PAYMENT_CASH_ON_DELIVERY])
    items = OrderLineInputSerializer(many=True, allow_empty=False)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_order(request):
    serializer = OrderCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    order_data = serializer.validated_data
    product_ids = {line["product_id"] for line in order_data["items"]}

    with transaction.atomic():
        products = Product.objects.in_bulk(product_ids)
        if len(products) != len(product_ids):
            return Response(
                {"error": "One or more products are no longer available. Please refresh your cart."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order_items = []
        total_amount = Decimal("0.00")
        for line in order_data["items"]:
            product = products[line["product_id"]]
            quantity = line["quantity"]
            total_amount += product.price * quantity
            order_items.append(
                {
                    "product_id": product.id,
                    "name": product.name,
                    "slug": product.slug,
                    "image": product.image or "",
                    "unit_price": str(product.price),
                    "quantity": quantity,
                }
            )

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            full_name=order_data["full_name"],
            email=order_data["email"],
            phone=order_data["phone"],
            address=order_data["address"],
            city=order_data["city"],
            postal_code=order_data["postal_code"],
            payment_method=order_data["payment_method"],
            items=order_items,
            total_amount=total_amount,
        )

    return Response(
        {
            "order_number": order.order_number,
            "total_amount": str(order.total_amount),
            "status": order.status,
            "payment_method": order.payment_method,
            "created_at": order.created_at,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by("-created_at")
    return Response([
        {
            "order_number": order.order_number,
            "full_name": order.full_name,
            "email": order.email,
            "phone": order.phone,
            "address": order.address,
            "city": order.city,
            "postal_code": order.postal_code,
            "payment_method": order.payment_method,
            "items": order.items,
            "total_amount": str(order.total_amount),
            "status": order.status,
            "created_at": order.created_at,
        }
        for order in orders
    ])
