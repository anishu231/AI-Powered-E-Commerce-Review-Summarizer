
import { useState, useEffect, useRef } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { ShoppingBag, Search, ShoppingCart, User, LogOut, LogIn, UserPlus, CheckCircle, XCircle } from "lucide-react"; 
import { logoutUser } from "@/lib/api"; 
import { getCartItems } from "@/lib/cart";

export function Header() { 
  const navigate = useNavigate(); 
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); 
  
  // URL se initial search text read karne ke liye logic
  const searchParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || ""); 
  
  const dropdownRef = useRef<HTMLDivElement>(null); 
  const [cartCount, setCartCount] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const username = localStorage.getItem("username") || "User"; 
  const isLoggedIn = !!localStorage.getItem("access"); 

  function syncGlobalCartCounter() {
    const totalItemsQty = getCartItems().reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItemsQty);
  }

  // URL badalne par input field ka text synced rakhne ke liye
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    setSearchQuery(currentParams.get("search") || "");
  }, [location.search]);

  useEffect(() => { 
    syncGlobalCartCounter(); 
    window.addEventListener("storage", syncGlobalCartCounter);
    window.addEventListener("cartUpdated", syncGlobalCartCounter);
    window.addEventListener("focus", syncGlobalCartCounter);

    function handleClickOutside(event: MouseEvent) { 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) { 
        setIsOpen(false); 
      } 
    } 
    document.addEventListener("mousedown", handleClickOutside); 
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); 
      window.removeEventListener("storage", syncGlobalCartCounter);
      window.removeEventListener("cartUpdated", syncGlobalCartCounter);
      window.removeEventListener("focus", syncGlobalCartCounter);
    };
  }, []); 

  // 🔥 INSTANT LIVE SEARCH: Har ek character type hone par URL update hoga
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim() === "") {
      navigate("/"); // Agar khali ho jaye toh home par normal list dikhe
    } else {
      navigate(`/?search=${encodeURIComponent(value)}`); // Dynamic text push to URL
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  }; 

  const handleLogout = async () => { 
    try { 
      try { await logoutUser(); } catch (apiError) {}
      setToastType("success");
      setToastMessage("Logged out successfully! 👋 See you soon.");
      setShowToast(true);
      localStorage.removeItem("access"); 
      localStorage.removeItem("refresh"); 
      localStorage.removeItem("username"); 
      localStorage.removeItem("email"); 
      window.dispatchEvent(new Event("storage"));
      setIsOpen(false); 
      setTimeout(() => { setShowToast(false); navigate("/login"); }, 2000);
    } catch (err: any) { 
      setToastType("error");
      setToastMessage("Something went wrong during logout.");
      setShowToast(true);
      localStorage.clear();
      setTimeout(() => { setShowToast(false); navigate("/login"); }, 2000);
    } 
  };

  return ( 
    <> 
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-card border-2 shadow-xl rounded-2xl px-5 py-4 min-w-[340px] max-w-md backdrop-blur-md bg-white/95 border-orange-500">
          {toastType === "success" ? (
            <div className="p-1.5 bg-orange-500 text-white rounded-xl"><CheckCircle className="h-5 w-5" /></div>
          ) : (
            <div className="p-1.5 bg-red-500 text-white rounded-xl"><XCircle className="h-5 w-5" /></div>
          )}
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600">System Alert</h4>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">{toastMessage}</p>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"> 
        <div className="container flex h-16 items-center justify-between gap-4"> 
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 flex-shrink-0"> 
            <ShoppingBag className="h-6 w-6 text-primary" /> 
            <span className="font-display text-xl font-semibold text-foreground"> AI-Powered E-Commerce Review Summarizer </span> 
          </Link> 

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2 sm:mx-4"> 
            <div className="relative flex items-center w-full"> 
              {/* FIXED INPUT: type karne par handleInputChange live fire hoga */}
              <input 
                type="text" 
                placeholder="Search products, brands..." 
                value={searchQuery} 
                onChange={handleInputChange} 
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-input rounded-xl focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary transition duration-150 ease-in-out" 
              /> 
              <div className="absolute left-3.5 text-muted-foreground pointer-events-none"> 
                <Search size={18} /> 
              </div> 
            </div> 
          </form> 

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0"> 
            <Link to="/cart" className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition duration-150" aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}>
              <ShoppingCart size={20} /> 
              {cartCount > 0 && ( 
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-destructive text-destructive-foreground rounded-full text-[10px] font-bold flex items-center justify-center border border-background shadow-sm"> 
                  {cartCount} 
                </span> 
              )} 
            </Link> 

            <div className="relative" ref={dropdownRef}> 
              <button onClick={() => setIsOpen(!isOpen)} className="flex items-center p-1 rounded-full border border-input bg-muted/40 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition duration-150" > 
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm uppercase"> 
                  {isLoggedIn && username ? username.charAt(0) : <User size={16} />} 
                </div> 
              </button> 

              {isOpen && ( 
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-popover text-popover-foreground shadow-xl border border-border py-2 z-50 transform origin-top-right transition duration-150"> 
                  {isLoggedIn && ( 
                    <div className="px-4 py-2 border-b border-border"> 
                      <p className="text-[11px] text-muted-foreground">Signed in as</p> 
                      <p className="text-sm font-semibold truncate text-foreground">{username}</p> 
                    </div> 
                  )} 
                  <ul className="space-y-0.5 mt-1"> 
                    {isLoggedIn ? ( 
                      <> 
                        <li> 
                          <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition" > 
                            <User size={16} /> <span>My Profile</span> 
                          </Link> 
                        </li> 
                        <li> 
                          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition font-medium" > 
                            <LogOut size={16} /> <span>Logout</span> 
                          </button> 
                        </li> 
                      </> 
                    ) : ( 
                      <> 
                        <li><Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition" ><LogIn size={16} /> <span>Login</span></Link></li> 
                        <li><Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition" ><UserPlus size={16} /> <span>Create Account</span></Link></li> 
                      </> 
                    )} 
                  </ul> 
                </div> 
              )} 
            </div> 
          </div> 
        </div> 
      </header> 
    </>
  ); 
}
