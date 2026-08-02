import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Shield, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { imageForExperience } from "@/lib/categories";
import { computeTotals, COUPONS } from "@/lib/cart";
import { toast } from "sonner";

type Search = { event: string; seats?: number; coupon?: string };

export const Route = createFileRoute("/_authenticated/checkout")({
  component: CheckoutPage,
  validateSearch: (s: Record<string, unknown>): Search => ({
    event: String(s.event ?? ""),
    seats: s.seats ? Math.max(1, parseInt(String(s.seats), 10)) : 1,
    coupon: typeof s.coupon === "string" ? s.coupon : undefined,
  }),
});

const INDIAN_STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];

function CheckoutPage() {
  const { event, seats: initialSeats, coupon: initialCoupon } = Route.useSearch();
  const navigate = useNavigate();
  const [exp, setExp] = useState<any>(null);
  const [seats, setSeats] = useState(initialSeats ?? 1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");


  const [coupon, setCoupon] = useState(initialCoupon ?? "");
  const [couponPct, setCouponPct] = useState(initialCoupon ? (COUPONS[initialCoupon.toUpperCase()] ?? 0) : 0);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    if (!event) { navigate({ to: "/experiences" }); return; }
    supabase.from("experiences").select("*").eq("id", event).maybeSingle().then(({ data }) => setExp(data));
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setName((data.user?.user_metadata as any)?.display_name ?? "");
    });
  }, [event]);

  if (!exp) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl animate-pulse px-6 py-16"><div className="h-64 rounded-3xl bg-rose-soft/40" /></div>
      </div>
    );
  }

  const totals = computeTotals(exp.price_inr, seats, couponPct);

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    const pct = COUPONS[code];
    if (!pct) { setCouponPct(0); toast.error("Invalid coupon"); return; }
    setCouponPct(pct);
    toast.success(`Coupon applied — ${pct}% off`);
  }

  function proceed() {
    if (!name.trim() || name.trim().length < 2) return toast.error("Please enter your full name");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast.error("Please enter a valid email");
    if (!/^[+0-9 \-]{7,15}$/.test(phone)) return toast.error("Please enter a valid mobile");

    if (!terms) return toast.error("Please accept the terms & conditions");

    sessionStorage.setItem("anout_checkout", JSON.stringify({
      event, seats, couponCode: couponPct ? coupon.toUpperCase() : null, couponPct,
      totals, billing: { name, email, phone},
      ts: Date.now(),
    }));
    navigate({ to: "/book/$id", params: { id: event }, search: { seats, coupon: couponPct ? coupon.toUpperCase() : undefined } as any });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <Link to="/experiences/$slug" params={{ slug: exp.slug }} className="inline-flex items-center gap-2 text-sm text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to experience
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card p-6 shadow-card-soft sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Checkout</div>
            <h1 className="mt-1 text-display text-3xl font-semibold text-ink">Billing & confirmation</h1>

            <h2 className="mt-6 text-display text-lg font-semibold text-ink">Billing details</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Full name *"><input value={name} onChange={(e) => setName(e.target.value)} className="input" /></Field>
              <Field label="Email *"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" /></Field>
              <Field label="Mobile *"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+91 ..." /></Field>
              
              <div className="sm:col-span-2"></div>

             
            </div>

            <h2 className="mt-8 text-display text-lg font-semibold text-ink">Have a coupon?</h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="coupon code"
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
              <button onClick={applyCoupon} className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream">Apply</button>
            </div>
            {couponPct > 0 && <div className="mt-2 text-xs font-semibold text-primary">✓ {coupon.toUpperCase()} — {couponPct}% off applied</div>}

            <label className="mt-6 flex items-start gap-3 rounded-2xl bg-rose-soft/20 p-4 text-sm">
              <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
              <span>I accept the <a href="#" className="font-semibold text-primary">Terms & Conditions</a>, cancellation policy, and confirm the details above are correct.</span>
            </label>

            <button onClick={proceed}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-luxe">
              Proceed to payment <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" /> Secure UPI payment. Booking confirmed after verification.
            </p>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-3xl bg-card p-6 shadow-luxe lg:sticky lg:top-24 lg:self-start">
            <img src={imageForExperience(exp.image_url, exp.category)} alt={exp.title} className="h-40 w-full rounded-2xl object-cover" />
            <h3 className="mt-3 text-display text-xl font-semibold text-ink">{exp.title}</h3>
            <div className="mt-2 space-y-1 text-xs text-foreground/80">
              <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary" />{new Date(exp.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{exp.location}, {exp.city}</div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-border p-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Tickets</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSeats(Math.max(1, seats - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-rose-soft/50 text-primary">−</button>
                <span className="text-display text-lg font-semibold">{seats}</span>
                <button type="button" onClick={() => setSeats(Math.min(exp.capacity, seats + 1))} className="grid h-8 w-8 place-items-center rounded-full bg-rose-soft/50 text-primary">+</button>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
              <Row k={`₹${exp.price_inr.toLocaleString("en-IN")} × ${seats}`} v={`₹${totals.subtotal.toLocaleString("en-IN")}`} />
              {totals.discount > 0 && <Row k={`Coupon (${couponPct}%)`} v={`− ₹${totals.discount.toLocaleString("en-IN")}`} />}
              <Row k="GST (5%)" v={`₹${totals.gst.toLocaleString("en-IN")}`} />
              <Row k="Platform fee" v={`₹${totals.platformFee.toLocaleString("en-IN")}`} />
              <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-sm font-semibold text-ink">Grand total</span>
                <span className="text-display text-2xl font-semibold text-ink">₹{totals.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
      <Footer />
      <style>{`.input{width:100%;border-radius:1rem;border:1px solid var(--border);background:var(--card);padding:.7rem .9rem;font-size:.875rem}.input:focus{outline:none;border-color:var(--primary)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/80">
      <span>{k}</span><span className="font-semibold text-ink">{v}</span>
    </div>
  );
}
