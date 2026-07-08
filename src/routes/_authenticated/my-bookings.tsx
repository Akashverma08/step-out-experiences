import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle2, XCircle, Ticket, Download, ChevronDown, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, imageForExperience } from "@/lib/categories";
import { generateTicketPDF } from "@/lib/ticket-pdf";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/my-bookings")({
  component: MyBookingsPage,
});


function MyBookingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  async function reload() {
    const { data } = await supabase
      .from("bookings")
      .select("*, experiences(*)")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    reload();
    // Live status updates via Realtime
    const ch = supabase
      .channel("my-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        reload();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="bg-hero-gradient pt-12 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your journey</div>
            <h1 className="mt-2 text-display text-4xl font-semibold text-ink sm:text-5xl">My bookings</h1>
            <p className="mt-2 text-muted-foreground">Track status, view QR tickets, and details of every experience you've reserved.</p>
          </motion.div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 animate-pulse rounded-3xl bg-rose-soft/30" />)}</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card-soft">
            <p className="text-lg text-muted-foreground">No bookings yet.</p>
            <Link to="/experiences" className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe">
              Browse experiences
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="overflow-hidden rounded-3xl bg-card shadow-card-soft"
              >
                <div className="grid gap-4 p-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:p-5 lg:grid-cols-[160px_minmax(0,1fr)_200px]">
                  <img src={imageForExperience(b.experiences.image_url, b.experiences.category)} alt={b.experiences.title} className="h-40 w-full rounded-2xl object-cover sm:h-full" loading="lazy" />
                  <div className="min-w-0">
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
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-foreground/70">
                      <span className="font-semibold text-ink">#{b.booking_number ?? b.id.slice(0, 8).toUpperCase()}</span>
                      <span>{b.seats} seat{b.seats > 1 ? "s" : ""}</span>
                      <span className="font-semibold text-ink">₹{b.amount_inr.toLocaleString("en-IN")}</span>
                      {b.upi_txn_id && <span>UPI #{b.upi_txn_id}</span>}
                      {b.status === "approved" && (
                        <button
                          onClick={async () => {
                            try {
                              await generateTicketPDF({
                                bookingNumber: b.booking_number ?? b.id.slice(0, 8).toUpperCase(),
                                bookingId: b.id, title: b.experiences.title, category: CATEGORIES.find((c) => c.slug === b.experiences.category)?.label,
                                dateISO: b.experiences.date, location: b.experiences.location, city: b.experiences.city,
                                seats: b.seats, amount: b.amount_inr, attendee: b.contact_name,
                                email: b.contact_email, phone: b.contact_phone, host: b.experiences.host_name, slug: b.experiences.slug,
                              });
                            } catch (e: any) { toast.error("Could not generate ticket"); }
                          }}
                          className="ml-auto inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold text-cream hover:opacity-90"
                        >
                          <FileText className="h-3 w-3" /> Download PDF ticket
                        </button>
                      )}
                    </div>
                    {b.admin_note && (
                      <div className="mt-3 rounded-2xl bg-rose-soft/40 p-3 text-xs text-foreground/80">
                        <span className="font-semibold text-primary">Note from team: </span>{b.admin_note}
                      </div>
                    )}
                  </div>

                  {b.status === "approved" ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-rose-soft/30 p-3">
                      <img alt="QR ticket" className="h-32 w-32 rounded-xl bg-white p-1" src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(JSON.stringify({ id: b.id, exp: b.experiences.slug, seats: b.seats, name: b.contact_name }))}`} />
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">Your QR ticket</div>
                      <a
                        href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(JSON.stringify({ id: b.id, exp: b.experiences.slug, seats: b.seats, name: b.contact_name }))}`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                      >
                        <Download className="h-3 w-3" /> Download
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-rose-soft/20 p-3 text-center text-xs text-muted-foreground">
                      <Ticket className="h-6 w-6 text-primary/60" />
                      <span>QR ticket unlocks after approval</span>
                    </div>
                  )}
                </div>

                <button onClick={() => setOpen(open === b.id ? null : b.id)} className="flex w-full items-center justify-center gap-1.5 border-t border-border/60 bg-rose-soft/10 py-2 text-xs font-semibold text-primary">
                  {open === b.id ? "Hide details" : "View booking details"} <ChevronDown className={`h-3.5 w-3.5 transition ${open === b.id ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {open === b.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="grid gap-2 border-t border-border/60 p-4 text-xs text-foreground/80 sm:grid-cols-2 sm:p-5">
                        <Detail k="Booked by" v={b.contact_name} />
                        <Detail k="Email" v={b.contact_email} />
                        <Detail k="Mobile" v={b.contact_phone} />
                        {b.city && <Detail k="City" v={b.city} />}
                        {b.age && <Detail k="Age" v={String(b.age)} />}
                        {b.gender && <Detail k="Gender" v={b.gender} />}
                        {b.emergency_contact && <Detail k="Emergency contact" v={b.emergency_contact} />}
                        {b.special_requests && <Detail k="Special requests" v={b.special_requests} />}
                        <Detail k="Booked on" v={new Date(b.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-rose-soft/20 p-2.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-foreground/90">{v}</div>
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
