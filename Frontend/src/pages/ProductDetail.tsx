

import { useParams, Link, useNavigate } from "react-router-dom"; 
import { Header } from "@/components/Header"; 
import { RatingStars } from "@/components/RatingStars"; 
import { AISummary } from "@/components/AISummary"; 
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { ArrowLeft, Loader2, ShoppingCart, Send, Star, CheckCircle, XCircle } from "lucide-react"; // 💡 FIXED: CheckCircle aur XCircle custom dynamic toast ke liye import kar diye hain
import { Helmet } from "react-helmet-async"; 
import { useState, useEffect } from "react"; 
import { ProductsProps } from "./Products"; 
import { productDetail, postProductReview } from "@/lib/api"; 

export default function ProductDetail() { 
  const { slug } = useParams<{ slug: string }>(); 
  const navigate = useNavigate(); 
  const [product, setProduct] = useState<ProductsProps | null>(null); 
  const [loading, setLoading] = useState(true); 
  
  // Form states code declarations 
  const [comment, setComment] = useState(""); 
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 
  const [submittingReview, setSubmittingReview] = useState(false); 

  // 💡 INBUILT LOGIC: Custom advanced state notifications controller triggers
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const isLoggedIn = !!localStorage.getItem("access"); 

  async function fetchProductDetail() { 
    if (!slug || slug === "undefined") return; 
    setLoading(true); 
    try { 
      const response = await productDetail(slug); 
      setProduct(response); 
    } catch (error) { 
      console.error("❌ Error fetching data detail:", error); 
    } finally { 
      setLoading(false); 
    } 
  } 

  useEffect(() => { 
    fetchProductDetail(); 
  }, [slug]); 

  const handleReviewSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!isLoggedIn) { 
      // 💡 FIXED: Purana default browser alert saaf kiya aur standard custom Red Error Toast lagaya
      setToastType("error");
      setToastMessage("Please login first to write feedback! 🔒");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 2000);
      return; 
    } 
    if (rating === 0) { 
      // 💡 FIXED: Purana standard browser alert clear kiya
      setToastType("error");
      setToastMessage("Please select rating stars first! ⭐️");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return; 
    } 

    setSubmittingReview(true); 
    try { 
      await postProductReview(slug!, { rating, comment }); 
      
      // 💡 FIXED: "localhost:8080 says" ko block karke solid dynamic profile alert active kiya
      setToastType("success");
      setToastMessage("Thank you! Review saved live successfully. 🎉");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);

      setComment(""); 
      setRating(0); 
      await fetchProductDetail(); 
    } catch (err: any) { 
      // 💡 FIXED: Error hone par user context block mein custom clear instruction text print hoga
      setToastType("error");
      if (err.response?.status === 401 || err.message?.includes("401")) {
        setToastMessage("❌ Authentication error. Please log in again.");
      } else {
        setToastMessage(err.response?.data?.error || "Failed to save comment item transaction.");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } finally { 
      setSubmittingReview(false); 
    } 
  }; 

  if (loading) { 
    return ( 
      <div className="min-h-screen bg-background flex items-center justify-center"> 
        <Loader2 className="h-8 w-8 animate-spin text-primary" /> 
      </div> 
    ); 
  } 

  if (!product) { 
    return ( 
      <div className="min-h-screen bg-background text-center py-20"> 
        <h1 className="text-xl font-bold">Product not found</h1> 
        <Link to="/" className="text-primary underline mt-2 inline-block">Back to catalog</Link> 
      </div> 
    ); 
  } 

  // CORE LIVE MATHEMATICAL MATRIX ANALYSIS ENGINE 
  const reviewsList = product.reviews || []; 
  const totalReviews = reviewsList.length; 
  const avgRating = totalReviews > 0 ? reviewsList.reduce((sum: number, r: any) => sum + Number(r.rating), 0) / totalReviews : 0; 
  
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }; 
  reviewsList.forEach((r: any) => { 
    const rate = Math.round(Number(r.rating)) as 5 | 4 | 3 | 2 | 1; 
    if (starCounts[rate] !== undefined) { 
      starCounts[rate]++; 
    } 
  }); 

  const imagePath = product.imageUrl || product.image || product.image_url || ""; 
  const absoluteImageUrl = imagePath.startsWith('http') ? imagePath : `http://localhost:8000${imagePath}`;
  return (
    <>
      <Helmet><title>{product.name} - Curated</title></Helmet>
      
      {/* ========================================================================= */}
      {/* 🔥 INBUILT LOGIC: Custom Premium Floating Toast Popup (No localhost alert) */}
      {/* ========================================================================= */}
      {showToast && (
        <div 
          // className={`fixed top-5 right-5 z-50 flex items-center gap-3 bg-card border-2 shadow-xl rounded-2xl px-5 py-4 min-w-[340px] max-w-md animate-in slide-in-from-top-6 duration-300 backdrop-blur-md bg-white/95 ${
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-card border-2 shadow-2xl rounded-2xl px-5 py-4 min-w-[340px] max-w-md animate-in slide-in-from-bottom-6 duration-300 backdrop-blur-md bg-white/95 ${
            toastType === "success" ? "border-orange-500" : "border-red-500"
          }`}
        >
          {toastType === "success" ? (
            <div className="p-1.5 bg-orange-500 text-white rounded-xl shadow-xs">
              <CheckCircle className="h-5 w-5" />
            </div>
          ) : (
            <div className="p-1.5 bg-red-500 text-white rounded-xl shadow-xs">
              <XCircle className="h-5 w-5" />
            </div>
          )}
          
          <div className="flex-1">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${
              toastType === "success" ? "text-orange-600" : "text-red-600"
            }`}>
              {toastType === "success" ? "System Alert" : "System Error"}
            </h4>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5 leading-snug">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6 md:py-10">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-4 w-4" /> Back to products
          </Link>
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl bg-white aspect-[4/3] relative border border-border/40 flex items-center justify-center p-4">
              <img src={absoluteImageUrl} alt={product.name} className="w-full h-full object-contain" />
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">{product.name}</h1>
                <div className="mt-3 flex items-center gap-3">
                  <RatingStars rating={avgRating} size="md" showValue />
                  <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</p>
              <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">{product.description}</p>
              <Button size="lg" className="w-full gap-2 md:w-auto"><ShoppingCart className="h-4 w-4" /> Add to Cart</Button>
            </div>
          </div>
          {/* CONTINUATION: DYNAMIC GRAPH ANALYSIS CARDS GRID */}
          <section className="mt-12 space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Reviews & AI Summary Insights</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border border-border/60 shadow-sm rounded-2xl p-6 bg-card flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4">Customer Reviews</h3>
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-border/40">
                    <div className="text-center">
                      <span className="text-5xl font-extrabold text-foreground tracking-tight">
                        {totalReviews > 0 ? avgRating.toFixed(1) : "0.0"}
                      </span>
                      <div className="mt-1"><RatingStars rating={avgRating} size="sm" /></div>
                      <p className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</p>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      {([5, 4, 3, 2, 1] as const).map((star) => {
                        const count = starCounts[star as 5 | 4 | 3 | 2 | 1];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center text-xs gap-3">
                            <span className="w-3 text-muted-foreground font-medium">{star}★</span>
                            <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden relative">
                              <div style={{ width: `${percentage}%` }} className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out" />
                            </div>
                            <span className="w-4 text-right text-muted-foreground font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
              <AISummary productSlug={product.slug} productSummary={product.review_summary} productName={product.name} />
            </div>

            {/* INTERACTIVE CUSTOM REVIEW PICKER FORM */}
            <Card className="border border-border/60 shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/20">
                <CardTitle className="font-display text-base font-bold text-foreground">Write Custom Manual Review Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoggedIn ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/30 pb-3">
                      <p className="text-sm text-muted-foreground font-medium">Select dynamic rating scale elements:</p>
                      <div className="flex items-center gap-1.5">
                        {([1, 2, 3, 4, 5]).map((star) => {
                          const active = star <= (hoverRating || rating);
                          return (
                            <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none transition transform active:scale-90" >
                              <Star size={22} fill={active ? "#fb923c" : "none"} stroke={active ? "#f97316" : "#9ca3af"} className="transition-colors duration-150" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <textarea required rows={3} placeholder="Write dynamic comments or share testing results experience..." value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-4 py-3 bg-muted/10 border border-input rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none text-sm transition resize-none" />
                    <div className="flex justify-end">
                      <button type="submit" disabled={submittingReview} className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl text-primary-foreground bg-primary hover:opacity-90 transition shadow-sm active:scale-95">
                        <Send className="h-3.5 w-3.5" />
                        {submittingReview ? "Submitting..." : "Post Review"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-sm text-muted-foreground">You must be logged into a verified customer account to manual post reviews.</p>
                    <Link to="/login" className="inline-block text-xs font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-xl transition">Go to Sign In Account</Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SCREENSHOT TYPE MOCKUP GRID VIEW REVIEWS */}
            <Card className="border border-border/60 shadow-sm bg-card rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="font-display text-lg">All Reviews</CardTitle></CardHeader>
              <CardContent className="p-6">
                {totalReviews > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviewsList.map((rev: any) => (
                      <div key={rev.id} className="bg-muted/10 p-5 rounded-2xl border border-border/30 space-y-3 flex flex-col justify-between shadow-xs animate-fade-in">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm uppercase">
                              {rev.author ? rev.author.charAt(0) : "U"}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground truncate max-w-[120px]">{rev.author || "Anonymous"}</h4>
                              <p className="text-[10px] text-muted-foreground">{rev.created_at}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5 text-orange-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} fill={i < Number(rev.rating) ? "currentColor" : "none"} stroke={i < Number(rev.rating) ? "none" : "currentColor"} className={i < Number(rev.rating) ? "text-orange-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed flex-1 pt-1 italic"> "{rev.comment || "No written feedback text experience provided."}" </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-sm text-muted-foreground text-center">No reviews yet. Be the first to share your feedback! ⭐️</p>
                )}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </>
  );
}

