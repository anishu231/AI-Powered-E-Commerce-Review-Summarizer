import io
import time
import uuid  # <-- FIXED: Top par unique slug identifier import add kiya
from datetime import timedelta
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.files.base import ContentFile
from django.utils.text import slugify  
from google import genai
from google.genai.errors import ClientError, ServerError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from PIL import Image  

from review_app.models import Product,Review
from review_app.serializers import ListProductSerializer, ProductDetailSerializer




# Initialize Gemini Client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def summarize_reviews(product_name, reviews):
    reviews_text = "\n".join(
        [ f"- {r.rating}/5: {r.comment if r.comment else 'No comment'}" for r in reviews ]
    )
    prompt_input = f"""
    You are an expert product review analyst. Analyze the following customer reviews.
    Product: {product_name}
    Customer Reviews: {reviews_text}
    Generate: 1. Overall Sentiment 2. Common Pros 3. Common Cons 4. Final Summary
    Keep the response concise and easy to read.
    """
    
    models_to_try = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro"]
    retries_per_model = 2
    
    for model_name in models_to_try:
        print(f"🔄 Attempting to use model: {model_name}")
        for attempt in range(retries_per_model):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt_input,
                )
                if not response.text:
                    raise Exception(f"Empty response received from {model_name}.")
                print(f"✅ Success! Summary generated using: {model_name}")
                return response.text
            except ServerError as e:
                print(f"⚠️ Gemini Server Error (503/Busy) on {model_name}: {e}")
                if attempt < retries_per_model - 1:
                    wait = (attempt + 1) * 3
                    print(f"🕒 Retrying {model_name} after {wait} seconds (Attempt {attempt + 1}/{retries_per_model})...")
                    time.sleep(wait)
                    continue
                print(f"❌ {model_name} failed completely. Moving to next model.")
                break
            except ClientError as e:
                print(f"❌ Gemini Client Error (Bad Request): {e}")
                raise
            except Exception as e:
                print(f"❌ Unexpected Error with {model_name}: {e}")
                break
                
    raise ServerError("All available Gemini models are currently busy or unavailable.")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_reviews_summary(request, slug):
    product = get_object_or_404(Product, slug=slug)
    if product.summary_updated_at:
        next_allowed_time = product.summary_updated_at + timedelta(days=7)
        if timezone.now() < next_allowed_time:
            time_left = next_allowed_time - timezone.now()
            days_left = time_left.days + (1 if time_left.seconds > 0 else 0)
            return Response(
                {
                    "detail": "Summary already generated.",
                    "summary": product.review_summary,
                    "generated_at": product.summary_updated_at,
                    "next_allowed_at": next_allowed_time,
                    "days_left": days_left,
                    "newly_created": False,
                },
                status=status.HTTP_200_OK,
            )

    reviews = product.reviews.order_by("-created_at")[:10]
    if not reviews.exists():
        return Response({"error": "No reviews available."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        summary = summarize_reviews(product.name, reviews)
        product.review_summary = summary
        product.summary_updated_at = timezone.now()
        product.save(update_fields=["review_summary", "summary_updated_at"])
        return Response(
            {
                "product": product.name,
                "summary": summary,
                "generated_at": product.summary_updated_at,
                "days_left": 7,
                "newly_created": True,
            },
            status=status.HTTP_201_CREATED,
        )
    except ServerError as e:
        print(e)
        return Response({"error": "All Gemini models are temporarily unavailable. Please try again later."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except ClientError as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["GET"])
def product_detail(request, slug):
    product = get_object_or_404(Product, slug=slug)
    serializer = ProductDetailSerializer(product)
    return Response(serializer.data)


# ========================================================
# UPLOAD PRODUCT AUR UNIQUE SLUG INTEGRATION
# ========================================================


@api_view(["GET", "POST"]) 
@parser_classes([MultiPartParser, FormParser])
def products_api_wrapper(request):

    if request.method == "GET":
        products = Product.objects.all().order_by("-id")
        serializer = ListProductSerializer(products, many=True)
        return Response(serializer.data)

    
    elif request.method == "POST":
        
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required to upload products."}, status=status.HTTP_401_UNAUTHORIZED)
            
        try:
            name = request.data.get('name')
            description = request.data.get('description')
            price = request.data.get('price')
            image_file = request.FILES.get('image')

            if not all([name, description, price, image_file]):
                return Response({"error": "All fields (name, description, price, image) are required."}, status=status.HTTP_400_BAD_REQUEST)

            # Pillow image compression processing pipeline
            img = Image.open(image_file)
            output_stream = io.BytesIO()

            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img.save(output_stream, format='WEBP', quality=80)
            output_stream.seek(0)

            new_filename = f"product_{slugify(name)}_{int(time.time())}.webp"
            compressed_file = ContentFile(output_stream.read(), name=new_filename)

            # Safe unique slug formulation engine logic
            generated_slug = slugify(name)
            if not generated_slug:
                generated_slug = f"prod-{int(time.time())}"
                
            if Product.objects.filter(slug=generated_slug).exists():
                generated_slug = f"{generated_slug}-{str(uuid.uuid4())[:4]}"

            product = Product.objects.create(
                name=name,
                description=description,
                price=price,
                image=compressed_file,
                slug=generated_slug
            )

            return Response({
                "message": "Product published and compressed successfully! 🎉",
                "product": {
                    "id": product.id,
                    "name": product.name,
                    "price": str(product.price),
                    "imageUrl": product.image.url
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"❌ Product Upload Exception: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated]) # Strict validation trigger layer
def add_review(request, slug):
    try:
        product = get_object_or_404(Product, slug=slug)
        rating = request.data.get('rating')
        comment = request.data.get('comment')

        if not rating:
            return Response({"error": "Rating integer is mandatory."}, status=status.HTTP_400_BAD_REQUEST)

        # Create user comment dynamically using authorized request profile tokens
        review = Review.objects.create(
            product=product,
            user=request.user,
            author=request.user.username,
            rating=int(rating),
            comment=comment if comment else ""
        )

        return Response({
            "message": "Review added successfully! ⭐️",
            "review": {
                "id": review.id,
                "author": review.author,
                "rating": review.rating,
                "comment": review.comment,
                "created_at": review.created_at.strftime("%b %d, %Y")
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_review(request, slug):
    try:
        product = get_object_or_404(Product, slug=slug)
        rating = request.data.get('rating')
        comment = request.data.get('comment')

        if not rating:
            return Response({"error": "Rating is required."}, status=status.HTTP_400_BAD_REQUEST)

        review = Review.objects.create(
            product=product,
            user=request.user,
            author=request.user.username,
            rating=int(rating),
            comment=comment if comment else ""
        )

        return Response({"message": "Review published live! 🎉"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

