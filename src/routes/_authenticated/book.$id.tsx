import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Upload, Check, ArrowLeft, Copy, CreditCard, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, imageForExperience } from "@/lib/categories";
import { computeTotals, COUPONS } from "@/lib/cart";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay.functions";
import { openRazorpay } from "@/lib/razorpay-client";
import { toast } from "sonner";

type BookSearch = { seats?: number; coupon?: string };
export const Route = createFileRoute("/_authenticated/book/$id")({
  component: BookingPage,
  validateSearch: (s: Record<string, unknown>): BookSearch => ({
    seats: s.seats ? Math.max(1, parseInt(String(s.seats), 10)) : undefined,
    coupon: typeof s.coupon === "string" ? s.coupon : undefined,
  }),
});

const UPI_ID = "anoutandabout@upi";
const UPI_NAME = "AN Out & About";



function BookingPage() {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const rzpCreate = useServerFn(createRazorpayOrder);
  const rzpVerify = useServerFn(verifyRazorpayPayment);
  const [exp, setExp] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [seats, setSeats] = useState(search.seats ?? 1);
  const couponPct = search.coupon ? (COUPONS[search.coupon.toUpperCase()] ?? 0) : 0;
  const [contactName, setContactName] = useState("");

  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");


  const [special, setSpecial] = useState("");
  const [terms, setTerms] = useState(false);


  const [upiTxn, setUpiTxn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
  // Load experience
  supabase
    .from("experiences")
    .select("*")
    .eq("id", id)
    .maybeSingle()
    .then(({ data }) => setExp(data));

  // If user came from Checkout, use those details
  const saved = sessionStorage.getItem("anout_checkout");

  if (saved) {
    const checkout = JSON.parse(saved);

    setContactName(checkout.billing.name);
    setContactEmail(checkout.billing.email);
    setContactPhone(checkout.billing.phone);
    setSeats(checkout.seats);
  } else {
    // Otherwise use logged-in user info
    supabase.auth.getUser().then(({ data }) => {
      setContactEmail(data.user?.email ?? "");
      setContactName((data.user?.user_metadata as any)?.display_name ?? "");
    });
  }
}, [id]);


  if (!exp) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl animate-pulse px-6 py-16"><div className="h-64 rounded-3xl bg-rose-soft/40" /></div>
      </div>
    );
  }

  const totals = computeTotals(exp.price_inr, seats, couponPct);
  const total = totals.total;
  const subtotal = totals.subtotal;
  const discount = totals.discount;
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent(exp.title)}`;

  function validateStep1(): string | null {
    if (!contactName.trim()) return "Please enter your name";

    if (!/^[+0-9 \-]{7,15}$/.test(contactPhone))
      return "Please enter a valid mobile number";

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail))
      return "Please enter a valid email";

    if (!terms)
      return "Please accept the Terms & Conditions";

    return null;
  }

  function goToPay() {
    const err = validateStep1();
    if (err) { toast.error(err); return; }
    setStep(2);
  }

  async function payWithRazorpay() {
    const err = validateStep1();
    if (err) { toast.error(err); setStep(1); return; }
    setBusy(true);
    try {
      const order = await rzpCreate({
        data: {
          experienceId: exp.id,
          seats,
          couponCode: search.coupon ?? null,
          terms_accepted: terms,
          billing: {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          },
          attendee: {
            special_requests: special || undefined,
          },


        },
      });

      await openRazorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "AN Out & About",
        description: exp.title,
        prefill: { name: contactName, email: contactEmail, contact: contactPhone },
        notes: { booking_id: order.bookingId, experience: exp.slug },
        theme: { color: "#e11d48" },
        modal: {
          ondismiss: () => {
            setBusy(false);
            toast("Payment cancelled. You can retry any time.");
          },
        },
        handler: async (resp) => {
          try {
            await rzpVerify({
              data: {
                bookingId: order.bookingId,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              },
            });
            try {
              await (supabase as any).from("cart_items").delete().eq("experience_id", exp.id);
              window.dispatchEvent(new CustomEvent("cart:changed"));
              sessionStorage.removeItem("anout_checkout");
            } catch { }
            toast.success("Payment successful! Your ticket is ready.");
            navigate({ to: "/booking-success/$id", params: { id: order.bookingId } });
          } catch (e: any) {
            toast.error(e.message ?? "Payment verification failed");
            setBusy(false);
          }
        },
      });
    } catch (e: any) {
      toast.error(e.message ?? "Could not start payment");
      setBusy(false);
    }
  }

  async function submitBooking() {
    if (!file) { toast.error("Please upload your payment screenshot"); return; }
    setBusy(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user!.id;
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${uid}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("payment-screenshots").upload(path, file);
      if (upErr) throw upErr;

      const insertPayload: any = {
        user_id: uid,
        experience_id: exp.id,
        seats,
        amount_inr: total,
        upi_txn_id: upiTxn || null,
        payment_screenshot_url: path,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        special_requests: special || null,
        terms_accepted: terms,
        payment_method: "upi_manual",
        gst_inr: totals.gst,
        platform_fee_inr: totals.platformFee,
        discount_inr: totals.discount,
        coupon_code: search.coupon ?? null,
      };
      
      const { data: inserted, error: insErr } = await (supabase as any).from("bookings").insert(insertPayload).select("id").maybeSingle();
      if (insErr) throw insErr;

      // Clear this event from cart + checkout snapshot
      try {
        await (supabase as any).from("cart_items").delete().eq("user_id", uid).eq("experience_id", exp.id);
        window.dispatchEvent(new CustomEvent("cart:changed"));
        sessionStorage.removeItem("anout_checkout");
      } catch { }

      toast.success("Booking submitted! We'll verify and confirm within 12 hours.");
      navigate({ to: "/booking-success/$id", params: { id: inserted!.id } });
    } catch (err: any) {
      toast.error(err.message ?? "Booking failed");
    } finally {
      setBusy(false);
    }
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-10">
        <Link to="/experiences/$slug" params={{ slug: exp.slug }} className="inline-flex items-center gap-2 text-sm text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to experience
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl bg-card p-5 shadow-card-soft sm:p-7">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`flex h-8 items-center gap-2 rounded-full px-3 text-xs font-semibold transition ${step >= n ? "bg-rose-gradient text-primary-foreground" : "bg-rose-soft/40 text-foreground/60"}`}>
                  {step > n ? <Check className="h-3.5 w-3.5" /> : <span>{n}</span>}
                  {n === 1 ? "Details" : n === 2 ? "Pay via UPI" : "Verify"}
                </div>
              ))}
            </div>

            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-display text-2xl font-semibold text-ink">Your details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  

                 

                
                </div>

                

                <Field label="Special requests (optional)">
                  <textarea value={special} onChange={(e) => setSpecial(e.target.value)} rows={3} className="input" placeholder="Dietary needs, accessibility, etc." />
                </Field>

                <label className="flex items-start gap-3 rounded-2xl bg-rose-soft/20 p-4 text-sm">
  <input
    type="checkbox"
    checked={terms}
    onChange={(e) => setTerms(e.target.checked)}
    className="mt-0.5 h-4 w-4 accent-primary"
  />

  <span>
    I accept the Terms & Conditions and cancellation policy.
  </span>
</label>

<button
  onClick={goToPay}
  className="w-full rounded-full bg-rose-gradient px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-luxe"
>
  Continue to Payment
</button>

                

              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h2 className="text-display text-2xl font-semibold text-ink">Choose how to pay ₹{total.toLocaleString("en-IN")}</h2>

                <div className="rounded-2xl border-2 border-primary/40 bg-rose-soft/20 p-5">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Recommended · Instant
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-display text-lg font-semibold text-ink">Pay with Razorpay</div>
                      <div className="text-xs text-muted-foreground">UPI · Cards · Netbanking · Wallets. Ticket confirmed instantly.</div>
                    </div>
                  </div>
                  <button
                    onClick={payWithRazorpay}
                    disabled={busy}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-luxe disabled:opacity-60"
                  >
                    {busy ? "Opening…" : `Pay ₹${total.toLocaleString("en-IN")} securely`}
                  </button>
                  <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" /> 256-bit SSL · PCI-DSS · Razorpay verified
                  </div>
                </div>

                <div className="flex items-center gap-3 py-1"><div className="h-px flex-1 bg-border" /><span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">or pay manually via UPI</span><div className="h-px flex-1 bg-border" /></div>

                <div className="rounded-2xl bg-card p-5 shadow-card-soft">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">UPI ID</div>
                      <div className="text-display text-xl font-semibold text-ink">{UPI_ID}</div>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success("UPI ID copied"); }} className="inline-flex items-center gap-2 rounded-full bg-rose-soft/40 px-4 py-2 text-xs font-semibold text-primary">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm text-foreground/80">
                    <span>Amount</span>
                    <span className="text-display text-lg font-semibold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <a href={upiLink} className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-ink">
                    Open UPI app to pay
                  </a>
                  <div className="mt-3 grid place-items-center">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`} alt="UPI QR" className="h-36 w-36 rounded-lg bg-white p-2" />
                    <div className="mt-1 text-[11px] text-muted-foreground">Scan with any UPI app</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-ink">Uploaded screenshot? Continue →</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-display text-2xl font-semibold text-ink">Upload payment proof</h2>
                <Field label="UPI transaction ID (optional)"><input value={upiTxn} onChange={(e) => setUpiTxn(e.target.value)} className="input" placeholder="e.g. 412345678901" /></Field>
                <Field label="Payment screenshot *">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-rose-soft/20 px-4 py-8 text-center transition hover:border-primary">
                    <Upload className="h-6 w-6 text-primary" />
                    <span className="text-sm text-foreground/80">{file ? file.name : "Click to upload (PNG / JPG)"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  </label>
                </Field>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold">Back</button>
                  <button onClick={submitBooking} disabled={!file || busy} className="flex-1 rounded-full bg-rose-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-luxe disabled:opacity-60">
                    {busy ? "Submitting…" : "Submit booking"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Our team reviews payments within 12 hours. You'll see status under "My Bookings".</p>
              </motion.div>
            )}
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="rounded-3xl bg-card p-6 shadow-luxe lg:sticky lg:top-24 lg:self-start">
            <img src={imageForExperience(exp.image_url, exp.category)} alt={exp.title} className="h-40 w-full rounded-2xl object-cover" />
            <span className="mt-3 inline-block rounded-full bg-rose-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              {CATEGORIES.find((c) => c.slug === exp.category)?.label ?? exp.category}
            </span>
            <h3 className="mt-2 text-display text-xl font-semibold text-ink">{exp.title}</h3>
            <div className="mt-3 space-y-1.5 text-xs text-foreground/80">
              <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary" />{new Date(exp.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{exp.location}, {exp.city}</div>
            </div>
            <div className="mt-5 space-y-2 border-t border-border/60 pt-4 text-sm">
              <Row k="Price / seat" v={`₹${exp.price_inr.toLocaleString("en-IN")}`} />
              <Row k="Seats" v={String(seats)} />
              <Row k="Subtotal" v={`₹${subtotal.toLocaleString("en-IN")}`} />
              {discount > 0 && <Row k={`Coupon (${couponPct}%)`} v={`− ₹${discount.toLocaleString("en-IN")}`} />}
              <Row k="GST (5%)" v={`₹${totals.gst.toLocaleString("en-IN")}`} />
              <Row k="Platform fee" v={`₹${totals.platformFee.toLocaleString("en-IN")}`} />
              <Row k="Total" v={`₹${total.toLocaleString("en-IN")}`} bold />
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
function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={bold ? "text-display text-lg font-semibold text-ink" : "font-semibold text-ink"}>{v}</span>
    </div>
  );
}
