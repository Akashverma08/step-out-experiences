import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, MapPin, Download, Ticket, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/_authenticated/booking-success/$id")({
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useParams();
  const [b, setB] = useState<any>(null);

  useEffect(() => {
    supabase.from("bookings").select("*, experiences(*)").eq("id", id).maybeSingle().then(({ data }) => setB(data));
  }, [id]);

  if (!b) return <div className="min-h-screen bg-background"><Navbar /><div className="mx-auto max-w-2xl animate-pulse px-6 py-16"><div className="h-64 rounded-3xl bg-rose-soft/40" /></div></div>;

  const bookingId = b.booking_number ?? b.id.slice(0, 8).toUpperCase();
  const qrData = encodeURIComponent(JSON.stringify({ id: b.id, exp: b.experiences.slug, seats: b.seats, name: b.contact_name }));
  const qrSmall = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${qrData}`;
  const qrLarge = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${qrData}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-rose-gradient text-primary-foreground shadow-luxe">
          <CheckCircle2 className="h-10 w-10" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Booking submitted</div>
          <h1 className="mt-2 text-display text-4xl font-semibold text-ink sm:text-5xl">You're (almost) in! ✦</h1>
          <p className="mt-3 text-muted-foreground">We'll verify your payment within 12 hours and confirm via email. Your QR ticket will unlock once approved.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mt-8 grid gap-6 rounded-3xl bg-card p-6 shadow-luxe sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Booking ID</div>
              <div className="text-display text-2xl font-semibold text-ink">#{bookingId}</div>
            </div>
            {b.upi_txn_id && (
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment Ref</div>
                <div className="text-sm font-semibold text-ink">{b.upi_txn_id}</div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-display text-xl font-semibold text-ink">{b.experiences.title}</h2>
            <div className="mt-2 grid gap-1.5 text-sm text-foreground/80 sm:grid-cols-2">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(b.experiences.date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{b.experiences.location}, {b.experiences.city}</div>
              <div className="flex items-center gap-2"><Ticket className="h-4 w-4 text-primary" />{b.seats} ticket{b.seats > 1 ? "s" : ""} · ₹{b.amount_inr.toLocaleString("en-IN")}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl bg-rose-soft/30 p-5 text-center">
            <img src={qrSmall} alt="QR" className={`h-40 w-40 rounded-xl bg-white p-2 ${b.status !== "approved" ? "opacity-50 grayscale" : ""}`} />
            <div className="text-xs font-semibold text-primary">{b.status === "approved" ? "Confirmed ticket" : "Activates after admin verification"}</div>
            <a href={qrLarge} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              <Download className="h-3.5 w-3.5" /> Download QR
            </a>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Link to="/experiences" className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-center text-sm font-semibold text-ink">
              Browse more
            </Link>
            <Link to="/my-bookings" className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-luxe">
              Go to My Orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}
