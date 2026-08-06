import io 
import time 
import uuid  # Safe dynamic slug auto-generation ke liye
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
from rest_framework.permissions import IsAuthenticated, AllowAny 
from rest_framework.parsers import MultiPartParser, FormParser 
from django.contrib.auth.models import User 
from django.core.mail import send_mail 
from PIL import Image 
import cloudinary.uploader  # Direct image storage upload stream helper
from review_app.models import Product, Review 
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
# ======================================================== #
# 📦 FIXED PRODUCT UPLOAD GATEWAY & CATALOG FETCH PIPELINE #
# ======================================================== #
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
                
            # 🎯 1. Secure Cloudinary Manual File Upload Stream
            upload_result = cloudinary.uploader.upload( 
                image_file, 
                folder="reviewpulse_products", 
                format="webp", 
                transformation=[{"quality": "auto:good"}] 
            ) 
            
            secure_cloud_url = upload_result.get("secure_url") 
            
            if not secure_cloud_url: 
                raise Exception("Failed to retrieve secure URL from Cloudinary cloud bucket.") 
            
            # Safe unique slug formulation engine logic 
            generated_slug = slugify(name) 
            if not generated_slug: 
                generated_slug = f"prod-{int(time.time())}" 
            if Product.objects.filter(slug=generated_slug).exists(): 
                generated_slug = f"{generated_slug}-{str(uuid.uuid4())[:4]}" 
                
            # 🎯 2. ABSOLUTE QUERY LAYER CORRECTION:
            # Table me 'imageUrl' naam ka column nahi bana tha jo pehle crash kar raha tha,
            # use yahan database write sequence se completely mita diya hai taaki Error 500 fix ho sake!
            product = Product.objects.create( 
                name=name, 
                description=description, 
                price=price, 
                image=secure_cloud_url,  # Direct parameter string allocation
                slug=generated_slug 
            ) 
            
            return Response({ 
                "message": "Product published and cloud-stored successfully! 🚀", 
                "product": { 
                    "id": product.id, 
                    "name": product.name, 
                    "price": str(product.price), 
                    "imageUrl": secure_cloud_url 
                } 
            }, status=status.HTTP_201_CREATED) 
            
        except Exception as e: 
            print(f"❌ Cloudinary Upload Exception Error: {str(e)}") 
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 


# ======================================================== #
# ⭐ CUSTOMER REVIEWS FEED INTERACTION PIPELINE MODULE    #
# ======================================================== #
@api_view(["POST"]) 
@permission_classes([IsAuthenticated]) 
def add_review(request, slug): 
    try: 
        product = get_object_or_404(Product, slug=slug) 
        rating = request.data.get('rating') 
        comment = request.data.get('comment') 
        
        if not rating: 
            return Response({"error": "Rating integer is mandatory."}, status=status.HTTP_400_BAD_REQUEST) 
            
        review = Review.objects.create( 
            product=product, 
            user=request.user, 
            author=request.user.username, 
            rating=int(rating), 
            comment=comment if comment else "" 
        ) 
        return Response({ 
            "message": "Review published live! 🎉", 
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


# =========================================================================
# 🔥 INTERCEPTOR ENGINE: New Account Registries with Automated Success Email
# =========================================================================
@api_view(["POST"]) 
@permission_classes([AllowAny]) 
def register_user(request): 
    try: 
        username = request.data.get("username") 
        email = request.data.get("email") 
        password = request.data.get("password") 
        
        if not all([username, email, password]): 
            return Response({"error": "Username, email and password are all required fields."}, status=status.HTTP_400_BAD_REQUEST) 
            
        if User.objects.filter(username=username).exists(): 
            return Response({"error": "Username is already taken."}, status=status.HTTP_400_BAD_REQUEST) 
            
        if User.objects.filter(email=email).exists(): 
            return Response({"error": "An account with this email address already exists."}, status=status.HTTP_400_BAD_REQUEST) 
            
        user = User.objects.create_user(username=username, email=email, password=password) 
        
        # Dynamic SMTP welcome email trigger pipeline 
        try: 
            subject = 'Welcome to ReviewPulse AI - Registration Successful! 🎉' 
            message = f'Hi {username},\n\nYou are registered successfully on our platform.\n\nBest regards,\nAI-Powered E-Commerce Review Summarizer Team' 
            recipient_list = [email] 
            
            send_mail( 
                subject, 
                message, 
                settings.DEFAULT_FROM_EMAIL, 
                recipient_list, 
                fail_silently=False, 
            ) 
            print(f"🚀 SMTP Delivery Success: Confirmation email triggered out to {email}") 
        except Exception as mail_err: 
            print(f"❌ SMTP Connection Layer Blocked: {str(mail_err)}") 
            
        return Response({"message": "Registration Successful 🎉 Account created under ReviewPulse AI registries."}, status=status.HTTP_201_CREATED) 
        
    except Exception as e: 
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
