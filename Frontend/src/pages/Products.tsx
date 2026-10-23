


import { ProductCard } from "@/components/ProductCard"; 
import { Header } from "@/components/Header"; 
import { Helmet } from "react-helmet-async"; 
import { useEffect, useState } from "react"; 
import { useLocation } from "react-router-dom"; 
import { productList } from "@/lib/api"; 
import ProductListSkeleton from "@/components/ProductListSkeleton"; 
import { SearchX } from "lucide-react"; 

export interface Review { 
  id: number; 
  rating: number; 
  comment: string; 
  author: string; 
  created_at: string; 
} 

export interface ProductsProps { 
  id: number; 
  name: string; 
  slug: string; 
  price: number; 
  description: string; 
  image?: string; 
  imageUrl?: string; 
  image_url?: string; 
  reviews: Review[]; 
  summary_updated_at: string; 
  review_summary: string; 
} 

export default function Products() { 
  const location = useLocation(); 
  const [products, setProducts] = useState<any[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [loadError, setLoadError] = useState(false);

  const generateCleanSlug = (nameStr: string): string => { 
    if (!nameStr) return ""; 
    return nameStr.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''); 
  }; 

  async function fetchProducts() { 
    setLoading(true);
    setLoadError(false);
    try { 
      let response: any;
      let lastError: unknown;
      // Retry transient Render cold starts/network failures. Empty is a valid response.
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          response = await productList();
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
      if (lastError) throw lastError;

      const apiProducts = Array.isArray(response) ? response : []; 
      const cleanLiveProducts = apiProducts
        .filter((item: any) => item?.name && item.name.trim() !== "")
        .map((item: any) => ({ 
          ...item, 
          slug: item.slug && item.slug !== "undefined" ? item.slug : generateCleanSlug(item.name), 
          imageUrl: item.imageUrl || item.image || item.image_url || "" 
        })); 
      setProducts(cleanLiveProducts); 
      
      // Initial URLs parameters load checker logic
      const searchParams = new URLSearchParams(window.location.search);
      const query = searchParams.get("search")?.toLowerCase().trim() || "";
      if (query === "") {
        setFilteredProducts(cleanLiveProducts);
      } else {
        const matched = cleanLiveProducts.filter((p: any) => p.name.toLowerCase().includes(query));
        setFilteredProducts(matched);
      }
    } catch (error) { 
      setLoadError(true);
    } finally { 
      setLoading(false); 
    } 
  } 

  useEffect(() => { 
    fetchProducts(); 
  }, []); 

  // 🔥 ULTRA-FAST LIVE SCANNING PIPELINE: Realtime URL tracking engine
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search")?.toLowerCase().trim() || "";
    const matches = query
      ? products.filter((product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
        )
      : products;
    setFilteredProducts(matches);
  }, [location.search, products]); 

  return ( 
    <> 
      <Helmet> 
        <title>AI-Powered E-Commerce Review Summarizer</title> 
      </Helmet> 
      <div className="min-h-screen bg-background"> 
        <Header /> 
        <main className="container py-8 md:py-12"> 
          <div className="mb-8 text-center"> 
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl"> Our Collection </h1> 
            <p className="mt-2 text-muted-foreground"> Thoughtfully selected products for modern living </p> 
          </div> 

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"> 
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <ProductListSkeleton key={i} />)
            ) : loadError ? (
              <div className="col-span-full text-center py-20 border border-dashed rounded-2xl bg-muted/5 text-muted-foreground">
                <p className="text-base font-medium text-foreground">Products could not be loaded</p>
                <p className="text-xs mt-1">Server se connection nahi ho paya. Dobara try karein.</p>
                <button onClick={fetchProducts} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
              </div>
            ) : filteredProducts.length > 0 ? ( 
              filteredProducts.map((product, index) => ( 
                <div key={`${product.slug}-${product.id || index}`} className="transition-all duration-150"> 
                  <ProductCard product={product} /> 
                </div> 
              )) 
            ) : ( 
              <div className="col-span-full text-center py-20 border border-dashed rounded-2xl bg-muted/5 text-muted-foreground flex flex-col items-center justify-center"> 
                <SearchX className="h-12 w-12 text-muted-foreground/60 mb-3 stroke-[1.5]" />
                <p className="text-base font-medium text-foreground">No matching products found</p>
                <p className="text-xs mt-1 max-w-sm px-4">Aapke type kiye gaye word ke naam ka koi product nahi mila. Kripya doosra alphabet type kijiye!</p>
              </div> 
            )} 
          </div> 
        </main> 
      </div> 
    </> 
  ); 
}
