

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, KeyRound, CheckCircle2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic Toast states for notification types
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(form);
      
      const accessToken = response.access || response.data?.access;
      const refreshToken = response.refresh || response.data?.refresh;
      const usernameVal = response.username || response.data?.username || form.username;
      const emailVal = response.email || response.data?.email || "";

      if (accessToken) {
        localStorage.setItem("access", accessToken);
        if (refreshToken) localStorage.setItem("refresh", refreshToken);
        localStorage.setItem("username", usernameVal);
        localStorage.setItem("email", emailVal);
      } else {
        localStorage.setItem("access", "true");
      }
      
      localStorage.setItem("login_time", Date.now().toString());
      window.dispatchEvent(new Event("storage"));

      // SUCCESS STATE NOTIFICATION CONFIG
      setToastType("success");
      setToastMessage(`WELCOME BACK ${usernameVal.toUpperCase()} 🎉 Login Successful.`);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigate("/");
      }, 2300);

    } catch (err: any) {
      console.error(err);
      setToastType("error");
      if (err.response?.status === 401 || err.message?.includes("401")) {
        setToastMessage("❌ Invalid username or password! Please check your credentials.");
      } else {
        setToastMessage(err.response?.data?.error || err.message || "Failed to establish network connection.");
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Helmet><title>Welcome Back - Sign In</title></Helmet>

      {/* ========================================================================= */}
      {/* RESPONSIVE FLOATING TOAST POPUP: Fits perfectly on Mobile and PC Screens  */}
      {/* ========================================================================= */}
      {showToast && (
        <div 
          className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-5 z-50 flex items-center gap-3 bg-card border-2 shadow-xl rounded-2xl px-4 py-3.5 w-auto sm:min-w-[340px] sm:max-w-md animate-in slide-in-from-top-4 duration-300 backdrop-blur-md bg-white/95 ${
            toastType === "success" ? "border-orange-500" : "border-red-500"
          }`}
        >
          {toastType === "success" ? (
            <div className="p-1.5 bg-orange-500 text-white rounded-xl shadow-xs">
              <CheckCircle className="h-4 w-4" />
            </div>
          ) : (
            <div className="p-1.5 bg-red-500 text-white rounded-xl shadow-xs">
              <XCircle className="h-4 w-4" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-[11px] font-bold uppercase tracking-wider ${
              toastType === "success" ? "text-orange-600" : "text-red-600"
            }`}>
              {toastType === "success" ? "Login Successful" : "Authentication Error"}
            </h4>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5 leading-snug truncate">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* 🔥 FIXED RESPONSIVE WRAPPER: Mobile par vertical layout, PC screen par split side-by-side view */}
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans">
        
        {/* ========================================================================= */}
        {/* LEFT PANEL: Visible on PC (Side Panel) and Mobile (Top Banner)            */}
        {/* ========================================================================= */}
        <div className="relative flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-400 text-white overflow-hidden lg:min-h-screen">
          <div className="absolute top-0 left-0 -mt-20 -ml-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-96 h-96 bg-black/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2 relative z-10 mb-8 lg:mb-0">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <KeyRound className="h-5 w-5 text-orange-200" />
            </div>
            <span className="font-bold tracking-wider uppercase text-sm">AI-Powered E-Commerce Review Summarizer</span>
          </div>

          <div className="space-y-4 sm:space-y-6 max-w-lg my-auto relative z-10 py-6 lg:py-0">
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Manage Your <br /> <span className="text-amber-200">Custom Manual</span> Workspace.
            </h1>
            <p className="text-sm sm:text-lg text-orange-50 leading-relaxed">
              Log in to your personalized dashboard. Here, you can list new items via the authorized panel and monitor custom user reviews.
            </p>
            <div className="pt-4 sm:pt-6 space-y-3.5 border-t border-white/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-200 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-orange-50">Authorized Product Upload Control</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-200 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-orange-50">Local Database Review Management</span>
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
        <div className="flex flex-col justify-center items-center p-5 sm:p-12 lg:p-16 bg-card w-full">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-orange-500 transition-colors mb-1 font-medium focus:outline-none">
              <ArrowLeft className="h-4 w-4" /> Back to products
            </Link>
            
            <div className="text-center lg:text-left space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Please enter your details to sign in to your dashboard.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-[10px] sm:text-xs font-bold text-muted-foreground tracking-wide uppercase">Username</label>
                <input type="text" name="username" required placeholder="johndoe" value={form.username} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 bg-muted/10 border border-input rounded-xl text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all duration-200" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] sm:text-xs font-bold text-muted-foreground tracking-wide uppercase">Password</label>
                  <a href="#" className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition">Forgot password?</a>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" value={form.password} onChange={handleChange} className="w-full px-4 py-2.5 sm:py-3 bg-muted/10 border border-input rounded-xl text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all duration-200 pr-11" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors focus:outline-none">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all duration-150 transform active:scale-[0.98] shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm">
                {loading ? "Logging in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-xs sm:text-sm text-muted-foreground pt-1">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold underline underline-offset-4 transition">Create Account</Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
