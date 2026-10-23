

import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 
import { ArrowLeft, PackagePlus, Upload, DollarSign, Type, FileText, CheckCircle, XCircle } from "lucide-react"; // 💡 FIXED: CheckCircle aur XCircle toast ke liye import kiye hain
import { uploadProduct } from "@/lib/api"; 

export default function UploadProduct() { 
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false); 
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
  }); 
  const [imageFile, setImageFile] = useState<File | null>(null); 

  // 💡 INBUILT LOGIC: Custom advanced state notifications controller triggers
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
    setForm({ ...form, [e.target.name]: e.target.value }); 
  }; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files && e.target.files[0]) { 
      setImageFile(e.target.files[0]); 
    } 
  }; 

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!imageFile) { 
      // 💡 FIXED: Alert replaced with custom error toast
      setToastType("error");
      setToastMessage("Please upload a product image! 📁");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return; 
    } 
    
    setLoading(true); 
    try { 
      const formData = new FormData(); 
      formData.append("name", form.name); 
      formData.append("description", form.description); 
      formData.append("price", form.price); 
      formData.append("image", imageFile); 
      
      await uploadProduct(formData); 
      
      // 💡 FIXED: "localhost:8080 says" blocked. Launching premium top-center success toast
      setToastType("success");
      setToastMessage("Product published and compressed successfully! 🎉");
      setShowToast(true);

      // Home redirect handle timeline after toast display ends
      setTimeout(() => { 
        setShowToast(false);
        navigate("/"); 
      }, 2300);

    } catch (err: any) { 
      // 💡 FIXED: Catch block errors transformed to error toast
      setToastType("error");
      setToastMessage(err.message || "Failed to publish product");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } finally { 
      setLoading(false); 
    } 
  };
  return ( 
    <>
      {/* ========================================================================= */}
      {/* 🔥 INBUILT LOGIC: Advanced TOP-CENTER Toast Popup (Perfect screen layout) */}
      {/* ========================================================================= */}
      {showToast && (
        <div 
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-card border-2 shadow-xl rounded-2xl px-5 py-4 min-w-[340px] max-w-md animate-in slide-in-from-top-6 duration-300 backdrop-blur-md bg-white/95 ${
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
              {toastType === "success" ? " Product upload Successfully" : "Product Not upolad"}
            </h4>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5 leading-snug">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-10 px-4 sm:px-6 lg:px-8"> 
        <div className="max-w-2xl mx-auto space-y-6"> 
          <Link to="/profile" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/80 shadow-sm transition"> 
            <ArrowLeft size={16} /> Back to Profile 
          </Link> 
          
          <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"> 
            <div className="flex items-center gap-3 border-b border-border pb-4"> 
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl"> 
                <PackagePlus size={22} /> 
              </div> 
              <div> 
                <h1 className="text-xl font-bold text-foreground tracking-tight">Upload Our Products</h1> 
                <p className="text-xs text-muted-foreground">List a new item in the marketplace store</p> 
              </div> 
            </div> 

            <form onSubmit={handleSubmit} className="space-y-5"> 
              {/* Product Name Input */} 
              <div className="space-y-1.5"> 
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5"> 
                  <Type size={14} className="text-muted-foreground" /> Product Name 
                </label> 
                <input type="text" name="name" required placeholder="e.g., Premium Wireless Headphones" value={form.name} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-muted/20 border border-input rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none transition" /> 
              </div> 

              {/* Description Input */} 
              <div className="space-y-1.5"> 
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5"> 
                  <FileText size={14} className="text-muted-foreground" /> Description 
                </label> 
                <textarea name="description" required rows={4} placeholder="Write detailed specifications of your product..." value={form.description} onChange={handleInputChange} className="w-full px-4 py-2.5 text-sm bg-muted/20 border border-input rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none transition resize-none" /> 
              </div> 

              {/* Price Input */} 
              <div className="space-y-1.5"> 
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5"> 
                  <DollarSign size={14} className="text-muted-foreground" /> Price 
                </label> 
                <div className="relative flex items-center"> 
                  <span className="absolute left-4 text-sm font-medium text-muted-foreground">$</span> 
                  <input type="number" name="price" required min="0" step="0.01" placeholder="0.00" value={form.price} onChange={handleInputChange} className="w-full pl-8 pr-4 py-2.5 text-sm bg-muted/20 border border-input rounded-xl focus:ring-2 focus:ring-primary/40 focus:border-primary focus:outline-none transition" /> 
                </div> 
              </div> 

              {/* Image Upload Component */} 
              <div className="space-y-1.5"> 
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5"> 
                  <Upload size={14} className="text-muted-foreground" /> Upload Image 
                </label> 
                <div className="flex items-center justify-center w-full"> 
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input bg-muted/10 hover:bg-muted/30 rounded-xl cursor-pointer transition group"> 
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4"> 
                      <Upload size={24} className="text-muted-foreground group-hover:text-primary transition mb-2" /> 
                      <p className="text-xs font-medium text-foreground truncate max-w-xs"> 
                        {imageFile ? imageFile.name : "Click to upload product image"} 
                      </p> 
                      <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG or WEBP up to 5MB</p> 
                    </div> 
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} /> 
                  </label> 
                </div> 
              </div> 

              {/* Submit Button */} 
              <div className="pt-2"> 
                <button type="submit" disabled={loading} className="w-full py-3 px-4 text-sm font-semibold rounded-xl text-primary-foreground bg-primary hover:opacity-90 shadow-sm transition active:scale-[0.98] disabled:opacity-50" > 
                  {loading ? "Publishing..." : "Publish Product"} 
                </button> 
              </div> 
            </form> 
          </div> 
        </div> 
      </div> 
    </>
  ); 
}
