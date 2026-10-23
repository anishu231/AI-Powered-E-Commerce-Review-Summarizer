import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowDown, ArrowRight, BadgeCheck, MessageSquareText, SearchX, Sparkles, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import ProductListSkeleton from "@/components/ProductListSkeleton";
import { productList } from "@/lib/api";

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
  image_gallery?: { url: string; is_primary: boolean }[];
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
    return nameStr.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  async function fetchProducts() {
    setLoading(true);
    setLoadError(false);
    try {
      let response: any;
      let lastError: unknown;
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
          imageUrl: item.imageUrl || item.image || item.image_url || "",
        }));
      setProducts(cleanLiveProducts);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search")?.toLowerCase().trim() || "";
    setFilteredProducts(query
      ? products.filter((product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query))
        )
      : products
    );
  }, [location.search, products]);

  const featuredProduct = products.find((product) => product.imageUrl) || products[0];
  const featuredImage = featuredProduct?.imageUrl;
  const searchQuery = new URLSearchParams(location.search).get("search")?.trim() || "";

  return (
    <>
      <Helmet>
        <title>ReviewPulse — Shop smarter. Buy with confidence.</title>
        <meta name="description" content="Discover products with customer reviews made easier to understand. Shop with more clarity using AI-powered review insights." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {!searchQuery && (
            <section className="relative isolate overflow-hidden bg-[#142b24] text-white">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
                <div className="absolute -right-24 -top-44 h-[34rem] w-[34rem] rounded-full bg-orange-400/15 blur-3xl" />
                <div className="absolute -bottom-64 left-[28%] h-[30rem] w-[30rem] rounded-full bg-emerald-300/10 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
              </div>

              <div className="container grid min-h-[570px] items-center gap-12 py-14 md:grid-cols-[1.04fr_.96fr] md:py-20 lg:min-h-[630px] lg:gap-16">
                <div className="max-w-2xl">
                  <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-medium tracking-wide text-emerald-50/90 shadow-sm backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-orange-300" />
                    THE REVIEW FIRST MARKETPLACE
                  </div>
                  <h1 className="max-w-[12ch] font-display text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-6xl lg:text-[4.5rem]">
                    Shop smarter.
                    <span className="mt-1 block text-orange-300">Feel sure.</span>
                  </h1>
                  <p className="mt-6 max-w-lg text-base leading-7 text-emerald-50/75 sm:text-lg sm:leading-8">
                    Good finds deserve better decisions. Get the story behind every product with customer reviews, made easier to understand.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href="#collection" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-400 px-5 py-3 text-sm font-semibold text-[#18251e] shadow-lg shadow-orange-950/20 transition hover:-translate-y-0.5 hover:bg-orange-300">
                      Explore the collection
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a href="#how-it-works" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
                      How it works
                      <ArrowDown className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/15 pt-6 text-sm text-emerald-50/75">
                    <span className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-orange-300" /> Real customer reviews</span>
                    <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-orange-300" /> AI powered insights</span>
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-[470px] pb-6 pt-3 sm:pb-10">
                  <div className="absolute left-1/2 top-1/2 h-[82%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                  <div className="absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-orange-200/20" />

                  <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#f5f0e9] p-3 shadow-2xl shadow-black/30 sm:rotate-2 sm:p-4">
                    <div className="relative flex aspect-[1.12/1] items-center justify-center overflow-hidden rounded-[1.45rem] bg-[radial-gradient(ellipse_at_50%_42%,#fff_0%,#e6e1d8_68%,#d8d2c7_100%)]">
                      <div className="absolute left-8 top-8 h-40 w-40 rounded-full bg-orange-300/25 blur-3xl" />
                      {featuredImage ? (
                        <img src={featuredImage} alt={featuredProduct?.name || "Featured product"} onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }} className="relative z-10 h-[82%] w-[82%] object-contain drop-shadow-[0_24px_24px_rgba(31,41,35,0.2)] transition-transform duration-700 hover:scale-105" />
                      ) : (
                        <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full border border-white/80 bg-white/50 shadow-inner">
                          <Sparkles className="h-20 w-20 text-[#de7b3a]" strokeWidth={1.1} />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#59685c] shadow-sm backdrop-blur">
                        A clearer way to choose
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 px-2 pb-1 pt-4 sm:px-3 sm:pt-5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#879087]">A closer look</p>
                        <p className="mt-1 truncate font-display text-lg font-semibold text-[#23342a] sm:text-xl">{featuredProduct?.name || "Find your next favorite"}</p>
                      </div>
                      <div className="shrink-0 rounded-xl bg-[#e9eee7] p-3 text-[#35604b]">
                        <MessageSquareText className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-2 top-[18%] flex items-center gap-2 rounded-2xl border border-white/70 bg-white px-3.5 py-3 text-[#293c30] shadow-xl shadow-black/15 sm:-left-10 sm:gap-3 sm:px-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9eee7] text-[#35604b]"><MessageSquareText className="h-4 w-4" /></div>
                    <div><p className="text-[10px] font-medium text-[#788278]">Reviews, simplified</p><p className="text-xs font-semibold">The details that matter</p></div>
                  </div>
                  <div className="absolute -right-1 bottom-[4%] flex items-center gap-2 rounded-2xl border border-white/70 bg-white px-3.5 py-3 text-[#293c30] shadow-xl shadow-black/15 sm:-right-8 sm:gap-3 sm:px-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><Star className="h-4 w-4" fill="currentColor" /></div>
                    <div><p className="text-[10px] font-medium text-[#788278]">Made for confident shopping</p><p className="text-xs font-semibold">Less guesswork, more good picks</p></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section id="collection" className="scroll-mt-24 container py-14 md:py-[4.5rem]">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Thoughtful finds</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {searchQuery ? "Your search results" : "Good things, worth knowing."}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {searchQuery ? `Showing products related to “${searchQuery}”.` : "Explore everyday favorites with the customer feedback to help you choose."}
                </p>
              </div>
              {!searchQuery && !loading && products.length > 0 && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {products.length} {products.length === 1 ? "product" : "products"} to explore
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => <ProductListSkeleton key={index} />)
              ) : loadError ? (
                <div className="col-span-full flex flex-col items-center rounded-3xl border border-dashed border-border py-16 text-center text-muted-foreground">
                  <p className="text-base font-medium text-foreground">Products could not be loaded</p>
                  <p className="mt-1 text-sm">Server se connection nahi ho paya. Dobara try karein.</p>
                  <button onClick={fetchProducts} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <div key={`${product.slug}-${product.id || index}`} className="transition-all duration-300 hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center rounded-3xl border border-dashed border-border bg-muted/20 py-16 text-center text-muted-foreground">
                  <SearchX className="mb-3 h-10 w-10 opacity-50" strokeWidth={1.5} />
                  <p className="text-base font-medium text-foreground">No matching products found</p>
                  <p className="mt-1 max-w-sm px-4 text-sm">Try another product name or clear your search to see the full collection.</p>
                </div>
              )}
            </div>
          </section>

          {!searchQuery && (
            <section id="how-it-works" className="container pb-16 md:pb-24">
              <div className="grid gap-8 rounded-[2rem] bg-[#eee9df] px-6 py-9 sm:px-10 md:grid-cols-[.8fr_1.2fr] md:items-center md:gap-12 md:px-14 md:py-12">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a05c33]">A little more clarity</p>
                  <h2 className="mt-3 max-w-sm font-display text-3xl font-semibold leading-tight tracking-tight text-[#26372d] sm:text-4xl">Know what people really think.</h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-[#687168]">Spend less time digging through reviews and more time finding the right fit for you.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { step: "01", title: "Find a favorite", text: "Browse products for your everyday." },
                    { step: "02", title: "Get the gist", text: "See the useful details at a glance." },
                    { step: "03", title: "Choose with ease", text: "Make your next pick with confidence." },
                  ].map((item) => (
                    <div key={item.step} className="rounded-2xl border border-white/80 bg-white/65 p-4 sm:p-5">
                      <span className="text-xs font-semibold tracking-widest text-[#bb7045]">{item.step}</span>
                      <h3 className="mt-4 font-display text-base font-semibold text-[#26372d]">{item.title}</h3>
                      <p className="mt-2 text-xs leading-5 text-[#788078]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
