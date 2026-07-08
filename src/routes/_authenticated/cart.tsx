import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { imageForExperience } from "@/lib/categories";
import { removeFromCart, updateCartQty } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/cart")({
  component: CartPage,
});

type Row = {
  id: string;
  quantity: number;
  experience_id: string;
  experiences: any;
};

function CartPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await (supabase as any)
      .from("cart_items")
      .select("id, quantity, experience_id, experiences(*)")
      .eq("user_id", u.user.id)
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const onChange = () => load();
    window.addEventListener("cart:changed", onChange);
    return () => window.removeEventListener("cart:changed", onChange);
  }, []);

  async function change(id: string, qty: number) {
    try { await updateCartQty(id, qty); } catch (e: any) { toast.error(e.message); }
  }
  async function remove(id: string) {
    try { await removeFromCart(id); toast.success("Removed"); } catch (e: any) { toast.error(e.message); }
  }

  const subtotal = rows.reduce((s, r) => s + (r.experiences?.price_inr ?? 0) * r.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="bg-hero-gradient pt-12 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your cart</div>
          <h1 className="mt-2 text-display text-4xl font-semibold text-ink sm:text-5xl">Ready to check out</h1>
          <p className="mt-2 text-muted-foreground">Review your saved experiences and proceed to booking.</p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-rose-soft/30" />)}</div>
        ) : rows.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card-soft">
            <ShoppingBag className="mx-auto h-10 w-10 text-primary/60" />
            <p className="mt-3 text-lg text-muted-foreground">Your cart is empty.</p>
            <Link to="/experiences" className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe">
              Browse experiences
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-4">
              {rows.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="grid gap-4 rounded-3xl bg-card p-4 shadow-card-soft sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:p-5">
                  <img src={imageForExperience(r.experiences?.image_url, r.experiences?.category)} alt={r.experiences?.title}
                    className="h-40 w-full rounded-2xl object-cover sm:h-full" loading="lazy" />
                  <div className="min-w-0">
                    <Link to="/experiences/$slug" params={{ slug: r.experiences?.slug }} className="text-display text-lg font-semibold text-ink hover:text-primary break-words">
                      {r.experiences?.title}
                    </Link>
                    <div className="mt-1.5 grid gap-1 text-xs text-foreground/80 sm:grid-cols-2">
                      <div className="flex items-center gap-2 min-w-0"><Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span className="truncate">{r.experiences?.date && new Date(r.experiences.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0"><MapPin className="h-3.5 w-3.5 shrink-0 text-primary" /><span className="truncate">{r.experiences?.location}, {r.experiences?.city}</span></div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button aria-label="Decrease quantity" onClick={() => change(r.id, r.quantity - 1)} className="grid h-11 w-11 place-items-center rounded-full bg-rose-soft/50 text-primary"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="text-display text-lg font-semibold">{r.quantity}</span>
                      <button aria-label="Increase quantity" onClick={() => change(r.id, r.quantity + 1)} className="grid h-11 w-11 place-items-center rounded-full bg-rose-soft/50 text-primary"><Plus className="h-3.5 w-3.5" /></button>
                      <button onClick={() => remove(r.id)} className="ml-auto inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
                    <div>
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="text-display text-xl font-semibold text-ink">₹{((r.experiences?.price_inr ?? 0) * r.quantity).toLocaleString("en-IN")}</div>
                    </div>
                    <button onClick={() => navigate({ to: "/checkout", search: { event: r.experience_id, seats: r.quantity } as any })}
                      className="inline-flex items-center gap-1 rounded-full bg-rose-gradient px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-luxe sm:mt-3">
                      Checkout <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <aside className="rounded-3xl bg-card p-6 shadow-luxe lg:sticky lg:top-24 lg:self-start">
              <h3 className="text-display text-xl font-semibold text-ink">Cart summary</h3>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-foreground/80">
                  <span>Items ({rows.reduce((s, r) => s + r.quantity, 0)})</span>
                  <span className="font-semibold text-ink">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-muted-foreground">Taxes & platform fee calculated at checkout.</p>
              </div>
              <Link to="/experiences" className="mt-5 block text-center text-xs font-semibold text-primary">Continue browsing</Link>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
