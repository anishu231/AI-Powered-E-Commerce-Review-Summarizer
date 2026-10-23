import axios from "axios"; 

const apiClient = axios.create({ 
  // 🎯 CONNECTED LIVE ROOT ENDPOINT
  baseURL: "https://ai-powered-e-commerce-review-summarizer.onrender.com/api", 
  // Render free instances can take a while to wake after inactivity.
  timeout: 60000, 
  headers: { 
    "Content-Type": "application/json", 
  }, 
}); 

export const API = apiClient; 
export default apiClient; 

// 1. REQUEST INTERCEPTOR: Automatically attach token for secured endpoints 
apiClient.interceptors.request.use( 
  (config) => { 
    const url = config.url || ""; 
    const method = config.method?.toLowerCase() || ""; 
    
    // Check karein ki kya ye public route hai (Bina token ke chalne wale paths) 
    const isPublicRoute = 
      url.includes("/auth/register/") || 
      url.includes("/auth/login/") || 
      url.includes("/auth/refresh/") || 
      (url.includes("/products/") && method === "get"); 
      
    // Token sirf tabhi bhejein jab wo public route NAHI hai (Jaise profile, upload-product, post-review) 
    if (!isPublicRoute) { 
      const token = localStorage.getItem("access"); 
      if (token && token !== "true") { 
        config.headers.Authorization = `Bearer ${token}`; 
      } 
    } 
    return config; 
  }, 
  (error) => Promise.reject(error) 
); 

// 2. RESPONSE INTERCEPTOR: Auto session-guard system featuring background live JWT auto-refresh pipeline 
apiClient.interceptors.response.use( 
  (response) => response, 
  async (error) => { 
    const originalRequest = error.config; 
    
    // Agar backend se unauthorized (401) error ya signature code mismatch response aaye 
    if (error.response && error.response.status === 401 && !originalRequest._retry) { 
      const errorDetail = error.response.data?.detail || ""; 
      const errorCode = error.response.data?.code || ""; 
      
      if (errorDetail.includes("not valid") || errorDetail.includes("expired") || errorCode === "token_not_valid") { 
        originalRequest._retry = true; // Mark configuration request to prevent loop crash 
        const refreshToken = localStorage.getItem("refresh"); 
        
        if (refreshToken) { 
          try { 
            console.log("🔄 Access token expired. Triggering silent background refresh..."); 
            
            const refreshResponse = await axios.post("https://onrender.com", { 
              refresh: refreshToken, 
            }); 
            
            if (refreshResponse.status === 200) { 
              const newAccessToken = refreshResponse.data.access; 
              localStorage.setItem("access", newAccessToken); 
              
              // Original request headers dynamic modifier upgrade integration 
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; 
              console.log("🎉 Token refreshed successfully! Retrying original request pipeline."); 
              return apiClient(originalRequest); // Re-execute intercepted endpoint transaction 
            } 
          } catch (refreshError) { 
            console.error("❌ Refresh token has also expired. Forcing absolute logout routing."); 
            // Clean local cache context nodes only when refresh pipeline completely fails 
            localStorage.removeItem("access"); 
            localStorage.removeItem("refresh"); 
            localStorage.removeItem("username"); 
            localStorage.removeItem("email"); 
            alert("Your session has expired permanently. Please sign in again to resume! 🔒"); 
            window.location.href = "/login"; 
            return Promise.reject(refreshError); 
          } 
        } 
      } 
    } 
    return Promise.reject(error); 
  } 
); 

// ===================== AUTH SECTION ===================== 
export async function registerUser(data: { username: string; email: string; password: string; }) { 
  const response = await apiClient.post("/auth/register/", data); 
  return response.data; 
} 

export async function loginUser(data: { username: string; password: string; }) { 
  const response = await apiClient.post("/auth/login/", data); 
  localStorage.setItem("access", response.data.access); 
  localStorage.setItem("refresh", response.data.refresh); 
  localStorage.setItem("username", response.data.username); 
  localStorage.setItem("email", response.data.email); 
  return response.data; 
} 

export async function getProfile() { 
  const response = await apiClient.get("/auth/profile/"); 
  return response.data; 
} 

export async function logoutUser() { 
  const refresh = localStorage.getItem("refresh"); 
  const response = await apiClient.post("/auth/logout/", { refresh }); 
  localStorage.removeItem("access"); 
  localStorage.removeItem("refresh"); 
  localStorage.removeItem("username"); 
  localStorage.removeItem("email"); 
  return response.data; 
} 

// ===================== PRODUCTS SECTION ===================== 
export async function productList() { 
  const response = await apiClient.get("/products/"); 
  return response.data; 
} 

export async function productDetail(slug: string) { 
  const response = await apiClient.get(`/products/${slug}/`); 
  return response.data; 
} 

export async function uploadProduct(formData: FormData) { 
  const response = await apiClient.post("/products/", formData, { 
    headers: { 
      "Content-Type": "multipart/form-data", 
    }, 
  }); 
  return response.data; 
} 

export async function postProductReview(slug: string, reviewData: { rating: number; comment: string }) { 
  const response = await apiClient.post(`/products/${slug}/review/`, reviewData); 
  return response.data; 
} 

export async function generateReviewSummary(slug: string) { 
  const response = await apiClient.post(`/products/${slug}/generate-summary/`); 
  return response.data; 
} 

// ===================== UTILITY SECTION ===================== 
export function formatDate(isoDate: string): string { 
  return new Date(isoDate).toLocaleString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit", 
  }); 
}
