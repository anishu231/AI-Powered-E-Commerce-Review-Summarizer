import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ClipboardList, Loader2, PackageCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { getMyOrders } from "@/lib/api";

type OrderItem = { product_id: number; name: string; slug: string; image: string; unit_price: string; quantity: number };
type OrderRecord = {
  order_number: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  payment_method: string;
  items: OrderItem[];
  total_amount: string;
  status: string;
  created_at: string;
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("access")) {
      navigate("/login", { replace: true });
      return;
    }
    getMyOrders()
      .then(setOrders)
      .catch((requestError) => {
        if (requestError.response?.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        setError("We couldn't load your orders. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <>
      <Helmet><title>My Orders — ReviewPulse</title></Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-5xl py-8 md:py-12">
          <Link to="/profile" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to profile</Link>
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Your account</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">My Orders</h1>
            <p className="mt-2 text-sm text-muted-foreground">Order status, items and delivery information.</p>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading your orders...</div>
          ) : error ? (
            <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{error}</div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border px-6 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground/50" />
              <h2 className="mt-4 font-display text-xl font-semibold text-foreground">No orders yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">Orders placed while signed in will appear here.</p>
              <Link to="/" className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Explore products</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <article key={order.order_number} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Order number</p>
                      <h2 className="mt-1 font-semibold text-foreground">{order.order_number}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">{order.status}</span>
                  </div>

                  <div className="divide-y divide-border">
                    {order.items.map((item) => (
                      <div key={`${order.order_number}-${item.product_id}`} className="flex items-center gap-3 py-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted/40 p-1.5">
                          {item.image ? <img src={item.image} alt="" onError={(event) => { event.currentTarget.src = "/placeholder.svg"; }} className="h-full w-full object-contain" /> : <PackageCheck className="h-6 w-6 text-muted-foreground/50" />}
                        </div>
                        <div className="min-w-0 flex-1"><p className="text-sm font-medium text-foreground">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">Qty {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p></div>
                        <p className="text-sm font-semibold text-foreground">${(Number(item.unit_price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-5 border-t border-border pt-4 sm:grid-cols-2">
                    <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Delivering to</p><p className="mt-2 text-sm font-medium text-foreground">{order.full_name}</p><p className="mt-1 text-sm leading-5 text-muted-foreground">{order.address}, {order.city}, {order.postal_code}</p><p className="mt-1 text-sm text-muted-foreground">{order.phone} · {order.email}</p></div>
                    <div className="sm:text-right"><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</p><p className="mt-2 text-sm text-foreground">Cash on delivery</p><p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order total</p><p className="mt-1 text-xl font-semibold text-primary">${Number(order.total_amount).toFixed(2)}</p></div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
