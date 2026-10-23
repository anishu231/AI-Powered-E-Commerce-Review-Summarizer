import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, MapPin, PackageCheck, Phone, ShieldCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { createOrder } from "@/lib/api";
import { CartItem, getCartItems, removeOrderedItems } from "@/lib/cart";

type OrderForm = {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
};

const initialForm: OrderForm = {
  full_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postal_code: "",
};

export default function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmation, setConfirmation] = useState<{ orderNumber: string; total: string } | null>(null);

  useEffect(() => {
    const checkoutItems = location.state?.checkoutItems;
    setItems(Array.isArray(checkoutItems) && checkoutItems.length > 0 ? checkoutItems : getCartItems());
  }, [location.state]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const estimatedTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Add a product before placing an order.");
      return;
    }
    if (items.some((item) => !Number.isInteger(Number(item.id)) || Number(item.id) < 1)) {
      setErrorMessage("A product in your cart is no longer available. Remove it and add it again.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createOrder({
        ...form,
        payment_method: "cod",
        items: items.map((item) => ({ product_id: Number(item.id), quantity: item.quantity })),
      });
      removeOrderedItems(items);
      setItems([]);
      setConfirmation({ orderNumber: result.order_number, total: result.total_amount });
      navigate(location.pathname, { replace: true, state: null });
    } catch (error: any) {
      const responseErrors = error.response?.data?.errors;
      const firstFieldError = responseErrors && Object.values(responseErrors).flat(Infinity)[0];
      setErrorMessage(
        typeof firstFieldError === "string"
          ? firstFieldError
          : error.response?.data?.error || "We couldn't submit your order. Please check your details and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Delivery details — ReviewPulse</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 md:py-12">
          <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </Link>

          {confirmation ? (
            <section className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-border bg-card px-6 py-12 text-center sm:px-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-8 w-8" /></div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Order received</p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Thank you, {form.full_name.split(" ")[0]}.</h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Your order details have been saved. Payment is due on delivery.</p>
              <div className="mt-7 w-full rounded-2xl bg-muted/40 p-5 text-left">
                <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Order number</span><span className="font-semibold text-foreground">{confirmation.orderNumber}</span></div>
                <div className="mt-3 flex justify-between gap-4 border-t border-border pt-3 text-sm"><span className="text-muted-foreground">Order total</span><span className="font-semibold text-foreground">${Number(confirmation.total).toFixed(2)}</span></div>
              </div>
              <Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Back to shopping <ArrowRight className="h-4 w-4" /></Link>
              {localStorage.getItem("access") && <Link to="/profile/orders" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted">View my orders</Link>}
            </section>
          ) : items.length === 0 ? (
            <section className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-border px-6 py-14 text-center">
              <PackageCheck className="h-10 w-10 text-muted-foreground/60" />
              <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">Your cart is empty</h1>
              <p className="mt-2 text-sm text-muted-foreground">Add a product first, then come back to enter delivery details.</p>
              <Link to="/" className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Explore products</Link>
            </section>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Almost there</p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Delivery details</h1>
                <p className="mt-2 text-sm text-muted-foreground">Tell us where to deliver your order.</p>
              </div>

              <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-7">
                  <section className="space-y-5">
                    <div className="flex items-center gap-3 border-b border-border pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div>
                      <div><h2 className="font-display text-lg font-semibold text-foreground">Contact & delivery</h2><p className="text-xs text-muted-foreground">Fields marked * are required.</p></div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-1.5 text-sm font-medium text-foreground sm:col-span-2">Full name *
                        <input required name="full_name" autoComplete="name" maxLength={120} value={form.full_name} onChange={handleChange} placeholder="Name for delivery" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium text-foreground">Email address *
                        <input required type="email" name="email" autoComplete="email" maxLength={254} value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium text-foreground">Phone number *
                        <input required type="tel" name="phone" autoComplete="tel" pattern="[+0-9()\-\s]{7,24}" maxLength={24} value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium text-foreground sm:col-span-2">Street address *
                        <textarea required name="address" autoComplete="street-address" maxLength={1000} rows={3} value={form.address} onChange={handleChange} placeholder="House number, street, area" className="w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium text-foreground">City *
                        <input required name="city" autoComplete="address-level2" maxLength={100} value={form.city} onChange={handleChange} placeholder="City" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium text-foreground">PIN / postal code *
                        <input required name="postal_code" autoComplete="postal-code" maxLength={20} value={form.postal_code} onChange={handleChange} placeholder="Postal code" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-normal outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
                      </label>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-border bg-muted/20 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary"><Phone className="h-5 w-5" /></div>
                      <div><h2 className="text-sm font-semibold text-foreground">Cash on delivery</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Pay in cash when your order arrives. Online payment is not available yet.</p></div>
                      <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">Selected</span>
                    </div>
                  </section>

                  {errorMessage && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{errorMessage}</p>}

                  <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60">
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing order…</> : <>Place order · ${estimatedTotal.toFixed(2)} <ArrowRight className="h-4 w-4" /></>}
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Your delivery details are used to process this order.</p>
                </form>

                <aside className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">Your items</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
                  <div className="mt-5 space-y-4">
                    {items.map((item) => (
                      <div key={String(item.id)} className="flex items-center gap-3">
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted/40 p-1.5">
                          {item.imageUrl ? <img src={item.imageUrl} alt="" onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }} className="h-full w-full object-contain" /> : <PackageCheck className="h-6 w-6 text-muted-foreground/50" />}
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">{item.quantity}</span>
                        </div>
                        <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-medium text-foreground">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">${item.price.toFixed(2)} each</p></div>
                        <p className="shrink-0 text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex justify-between border-t border-border pt-4 text-sm font-semibold text-foreground"><span>Items total</span><span>${estimatedTotal.toFixed(2)}</span></div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">The final total is calculated from current product prices when you submit.</p>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
