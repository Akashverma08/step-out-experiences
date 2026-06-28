import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, imageForExperience } from "@/lib/categories";

export const Route = createFileRoute("/_authenticated/my-bookings")({
  component: MyBookingsPage,
});

function MyBookingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("bookings")
      .select("*, experiences(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="bg-hero-gradient pt-12 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your journey</div>
            <h1 className="mt-2 text-display text-5xl font-semibold text-ink">My bookings</h1>
            <p className="mt-2 text-muted-foreground">Track status and details of every experience you've reserved.</p>
          </motion.div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-3xl bg-rose-soft/30" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card-soft">
            <p className="text-lg text-muted-foreground">No bookings yet.</p>
            <Link to="/experiences" className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe">
              Browse experiences
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="grid grid-cols-[120px_1fr] gap-4 overflow-hidden rounded-3xl bg-card p-4 shadow-card-soft sm:grid-cols-[180px_1fr]"
              >
                <img src={imageForExperience(b.experiences.image_url, b.experiences.category)} alt={b.experiences.title} className="h-full w-full rounded-2xl object-cover" />
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-primary">{CATEGORIES.find((c) => c.slug === b.experiences.category)?.label}</div>
                      <h3 className="text-display text-xl font-semibold text-ink">{b.experiences.title}</h3>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="mt-2 grid gap-1 text-xs text-foreground/80 sm:grid-cols-2">
                    <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary" />{new Date(b.experiences.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{b.experiences.location}, {b.experiences.city}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-border/60 pt-3 text-xs text-foreground/70">
                    <span>{b.seats} seat{b.seats > 1 ? "s" : ""}</span>
                    <span className="font-semibold text-ink">₹{b.amount_inr.toLocaleString("en-IN")}</span>
                    {b.upi_txn_id && <span>UPI #{b.upi_txn_id}</span>}
                  </div>
                  {b.admin_note && (
                    <div className="mt-3 rounded-2xl bg-rose-soft/40 p-3 text-xs text-foreground/80">
                      <span className="font-semibold text-primary">Note from team: </span>{b.admin_note}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    pending: { Icon: Clock, label: "Pending verification", cls: "bg-gold/30 text-ink" },
    approved: { Icon: CheckCircle2, label: "Confirmed ✦", cls: "bg-green-100 text-green-800" },
    rejected: { Icon: XCircle, label: "Not approved", cls: "bg-destructive/15 text-destructive" },
  } as const;
  const { Icon, label, cls } = map[status as keyof typeof map] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${cls}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}
