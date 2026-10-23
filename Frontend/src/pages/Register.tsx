



import { useState } from "react"; 
import { registerUser } from "@/lib/api"; 
import { useNavigate, Link } from "react-router-dom"; 
import { Button } from "@/components/ui/button"; 
import { Eye, EyeOff, Sparkles, CheckCircle2, ArrowLeft, CheckCircle, XCircle } from "lucide-react"; 
import { Helmet } from "react-helmet-async";

export default function Register() { 
  const navigate = useNavigate(); 
  const [form, setForm] = useState({ 
    username: "", 
    email: "", 
    password: "", 
  }); 

  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 

  const [showToast, setShowToast] = useState(false); 
  const [toastMessage, setToastMessage] = useState(""); 
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const isPasswordInvalid = form.password.length > 0 && form.password.length < 6; 

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault(); 
    
    if (form.password.length < 6) { 
      setToastType("error");
      setToastMessage("Password must be at least 6 characters long."); 
      setShowToast(true); 
      setTimeout(() => setShowToast(false), 3000); 
      return; 
    } 

    setLoading(true); 
    try { 
      await registerUser(form); 
      
      setToastType("success");
      setToastMessage("Account created under Curated system registries."); 
      setShowToast(true); 

      setTimeout(() => { 
        setShowToast(false); 
        navigate("/login"); 
      }, 2300); 
    } catch (err: any) { 
      setToastType("error");
      setToastMessage(err.response?.data?.detail || err.message || "Registration failed. Try again."); 
      setShowToast(true); 
      setTimeout(() => setShowToast(false), 3500); 
    } finally { 
      setLoading(false); 
    } 
  };
  return ( 
    <> 
      <Helmet> 
        <title>Create an Account - Curated</title> 
      </Helmet> 

      {/* RESPONSIVE FLOATING TOAST POPUP */} 
      {showToast && ( 
        <div 
          className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-5 z-50 flex items-center gap-3 bg-card border-2 shadow-xl rounded-2xl px-4 py-3.5 w-auto sm:min-w-[340px] sm:max-w-md animate-in slide-in-from-top-4 duration-300 backdrop-blur-md bg-white/95 ${
            toastType === "success" ? "border-orange-500" : "border-red-500"
          }`}
        > 
          {toastType === "success" ? (
            <div className="p-1.5 bg-orange-500 text-white rounded-xl shadow-xs"><CheckCircle className="h-4 w-4" /></div>
          ) : (
            <div className="p-1.5 bg-red-500 text-white rounded-xl shadow-xs"><XCircle className="h-4 w-4" /></div>
          )}
          <div className="flex-1 min-w-0"> 
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${toastType === "success" ? "text-orange-600" : "text-red-600"}`}>
              {toastType === "success" ? `Registration Successful: Welcome ${form.username}` : "Registration Error"}
            </h4> 
            <p className="text-xs font-semibold text-muted-foreground mt-0.5 leading-snug truncate">{toastMessage}</p> 
          </div> 
        </div> 
      )} 

      {/* 🔥 FIXED RESPONSIVE WRAPPER: Mobile par content vertical block rahega, PC screen par split grid banega */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans"> 
        
        {/* ========================================================================= */} 
        {/* LEFT PANEL: Now visible on both PC (Side Panel) and Mobile (Top Banner)   */} 
        {/* ========================================================================= */} 
        <div className="relative flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-400 text-white overflow-hidden lg:min-h-screen"> 
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" /> 
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-black/5 rounded-full blur-3xl pointer-events-none" /> 
          
          <div className="flex items-center gap-2 relative z-10 mb-8 lg:mb-0"> 
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20"> 
              <Sparkles className="h-5 w-5 text-amber-200 animate-pulse" /> 
            </div> 
            <span className="font-bold tracking-wider uppercase text-sm">AI-Powered E-Commerce Review Summarizer</span> 
          </div> 

          <div className="space-y-4 sm:space-y-6 max-w-lg my-auto relative z-10 py-6 lg:py-0"> 
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight"> 
              AI-Powered Review <br /> <span className="text-amber-200">Summarization</span> Hub. 
            </h1> 
            <p className="text-sm sm:text-lg text-orange-50 leading-relaxed"> 
              Our goal is to make the e-commerce shopping experience transparent. This project scans scattered reviews using complex AI models to provide you with an instant, honest summary. 
            </p> 
            <div className="pt-4 sm:pt-6 space-y-3.5 border-t border-white/20"> 
              <div className="flex items-center gap-3"> 
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-200 shrink-0" /> 
                <span className="text-xs sm:text-sm font-medium text-orange-50">Instant AI Sentiment Mapping Engine</span> 
              </div> 
              <div className="flex items-center gap-3"> 
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-200 shrink-0" /> 
                <span className="text-xs sm:text-sm font-medium text-orange-50">Dynamic User-Driven Product Matrix</span> 
              </div> 
            </div> 
          </div> 
          
          <div className="text-[10px] sm:text-xs text-orange-100 relative z-10 mt-8 lg:mt-0"> 
            &copy; {new Date().getFullYear()} AI-Powered E-Commerce Review Summarizer Dashboard. All rights reserved. 
          </div> 
        </div> 

        {/* ========================================================================= */} 
        {/* RIGHT SIDE PANEL: Main Form Input Field Container                        */} 
        {/* ========================================================================= */} 
        <div className="flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-card w-full"> 
          <div className="w-full max-w-md space-y-6 sm:space-y-8"> 
            
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-orange-500 transition-colors mb-1 font-medium focus:outline-none" > 
              <ArrowLeft className="h-4 w-4" /> Back to products 
            </Link> 
            
            <div className="text-center lg:text-left space-y-1.5"> 
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"> Create an Account </h2> 
              <p className="text-xs sm:text-sm text-muted-foreground"> Join us today! It only takes a minute to set up. </p> 
            </div> 

            <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-5"> 
              
              <div className="space-y-1.5"> 
                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground tracking-wide uppercase"> Username </label> 
                <input 
                  type="text" 
                  required 
                  placeholder="johndoe" 
                  value={form.username} 
                  onChange={(e) => setForm({ ...form, username: e.target.value })} 
                  className="w-full px-4 py-2.5 sm:py-3 bg-muted/10 border border-input rounded-xl text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all duration-200" 
                /> 
              </div> 

              <div className="space-y-1.5"> 
                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground tracking-wide uppercase"> Email Address </label> 
                <input 
                  type="email" 
                  required 
                  placeholder="you@example.com" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="w-full px-4 py-2.5 sm:py-3 bg-muted/10 border border-input rounded-xl text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all duration-200" 
                /> 
              </div> 

              <div className="space-y-1.5"> 
                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground tracking-wide uppercase"> Password </label> 
                <div className="relative"> 
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    className={`w-full px-4 py-2.5 sm:py-3 bg-muted/10 border rounded-xl text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 transition-all duration-200 pr-11 ${ 
                      isPasswordInvalid 
                        ? "border-red-500 focus:ring-red-500/40 focus:border-red-500" 
                        : "border-input focus:ring-orange-500/40 focus:border-orange-500" 
                    }`} 
                  /> 
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-orange-500 transition-colors focus:outline-none" > 
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} 
                  </button> 
                </div> 
                
                {isPasswordInvalid && ( 
                  <p className="mt-1 text-[11px] text-red-600 font-medium animate-fade-in"> 
                    ⚠️ Password must be at least 6 characters long. 
                  </p> 
                )} 
              </div> 

              <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-150 transform active:scale-[0.98] shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm" > 
                {loading ? "Registering..." : "Sign Up"} 
              </Button> 
            </form> 
            
            <div className="text-center text-xs sm:text-sm text-muted-foreground pt-1"> 
              Already have an account?{" "} 
              <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold underline underline-offset-4 transition"> Sign In </Link> 
            </div> 
          </div> 
        </div> 

      </div> 
    </> 
  ); 
}
