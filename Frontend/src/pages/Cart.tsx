import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, PackageCheck, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { CartItem, getCartItems, removeCartItem, updateCartItemQuantity } from "@/lib/cart";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => setItems(getCartItems());
    syncCart();
    window.addEventListener("cartUpdated", syncCart);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("cartUpdated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Helmet><title>Your Cart — ReviewPulse</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 md:py-12">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your picks</p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Shopping cart</h1>
            </div>
            {itemCount > 0 && <p className="pb-1 text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? "item" : "items"}</p>}
          </div>

          {items.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ShoppingBag className="h-7 w-7" /></div>
              <h2 className="mt-5 font-display text-xl font-semibold text-foreground">Your cart is waiting for a good find.</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Add something you like and it will be ready here whenever you are.</p>
              <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                Explore products <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <section className="space-y-4" aria-label="Cart items">
                {items.map((item) => (
                  <article key={String(item.id)} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-5">
                    <Link to={`/products/${item.slug}`} className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/40 p-2 sm:h-28 sm:w-32">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }} className="h-full w-full object-contain" />
                      ) : (
                        <PackageCheck className="h-9 w-9 text-muted-foreground/50" />
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:min-h-24 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <Link to={`/products/${item.slug}`} className="line-clamp-2 font-display text-lg font-semibold text-foreground hover:text-primary">{item.name}</Link>
                        <p className="mt-1 text-sm font-medium text-primary">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="inline-flex items-center rounded-xl border border-border bg-background">
                          <button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={item.quantity <= 1} onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center rounded-l-xl text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span aria-live="polite" className="min-w-9 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                          <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-r-xl text-muted-foreground transition hover:bg-muted hover:text-foreground">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="w-20 text-right text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                        <button type="button" aria-label={`Remove ${item.name} from cart`} onClick={() => removeCartItem(item.id)} className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <aside className="h-fit rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="font-display text-xl font-semibold text-foreground">Order summary</h2>
                <div className="mt-5 space-y-3 border-b border-border pb-5 text-sm">
                  <div className="flex justify-between gap-4 text-muted-foreground"><span>Subtotal ({itemCount} items)</span><span className="font-medium text-foreground">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between gap-4 text-muted-foreground"><span>Shipping</span><span className="font-medium text-foreground">Calculated at checkout</span></div>
                </div>
                <div className="flex justify-between gap-4 pt-5 text-base font-semibold text-foreground"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">Shipping and payment options can be added when checkout is enabled.</p>
                <Link to="/" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Keep exploring <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </aside>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
