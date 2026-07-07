import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Eye, Plus, Trash2, ShieldCheck, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, imageForExperience } from "@/lib/categories";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!role) throw redirect({ to: "/" });
  },
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<"bookings" | "experiences">("bookings");
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="bg-hero-gradient pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
          <div className="mt-3 flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-display text-4xl font-semibold text-ink">Admin panel</h1>
          </div>
          <div className="mt-6 inline-flex items-center gap-1 rounded-full bg-card p-1 shadow-card-soft">
            {(["bookings", "experiences"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                  tab === t ? "bg-rose-gradient text-primary-foreground shadow" : "text-foreground/70"
                }`}
              >{t}</button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {tab === "bookings" ? <BookingsAdmin /> : <ExperiencesAdmin />}
      </section>
      <Footer />
    </div>
  );
}

function BookingsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected" | "refunded" | "failed">("pending");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*, experiences(title, slug, category, image_url, date, location, city)")
      .order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: "approved" | "rejected", note?: string) {
    const { error } = await supabase.from("bookings").update({ status, admin_note: note ?? null }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Booking ${status}`); load(); }
  }

  async function viewScreenshot(path: string) {
    const { data, error } = await supabase.storage.from("payment-screenshots").createSignedUrl(path, 600);
    if (error || !data) { toast.error("Could not load screenshot"); return; }
    window.open(data.signedUrl, "_blank");
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const statuses = ["pending", "approved", "rejected", "refunded", "failed", "all"] as const;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
              filter === s ? "bg-rose-gradient text-primary-foreground" : "bg-card text-foreground/70"
            }`}
          >{s} {s !== "all" && `(${items.filter(i => i.status === s).length})`}</button>
        ))}
      </div>

      {loading ? <div className="h-40 animate-pulse rounded-3xl bg-rose-soft/30" /> :
       filtered.length === 0 ? <div className="rounded-3xl bg-card p-10 text-center text-muted-foreground shadow-card-soft">No {filter} bookings.</div> :
       <div className="space-y-4">
         {filtered.map((b, i) => (
           <motion.div
             key={b.id}
             initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}
             className="grid grid-cols-1 gap-5 rounded-3xl bg-card p-5 shadow-card-soft md:grid-cols-[140px_1fr_auto]"
           >
             <img src={imageForExperience(b.experiences.image_url, b.experiences.category)} alt="" className="h-32 w-full rounded-2xl object-cover" />
             <div>
               <div className="flex flex-wrap items-center gap-2">
                 <h3 className="text-display text-lg font-semibold text-ink">{b.experiences.title}</h3>
                 <span className="rounded-full bg-rose-soft/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">#{b.booking_number ?? b.id.slice(0, 8)}</span>
                 <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${b.payment_method === "razorpay" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
                   {b.payment_method === "razorpay" ? "Razorpay" : "UPI manual"}
                 </span>
               </div>
               <div className="mt-1 text-xs text-muted-foreground">{new Date(b.experiences.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {b.experiences.city}</div>
               <div className="mt-3 grid gap-1 text-xs text-foreground/80 sm:grid-cols-2">
                 <div><b>{b.contact_name}</b> · Age {b.age} · {b.gender}</div>
                 <div>{b.contact_email}</div>
                 <div>{b.contact_phone}</div>
                 <div>{b.seats} seat(s) · ₹{b.amount_inr.toLocaleString("en-IN")}</div>
                 {b.city && <div>City: {b.city}</div>}
                 {b.emergency_contact && <div>Emergency: {b.emergency_contact}</div>}
                 {b.upi_txn_id && <div className="sm:col-span-2">UPI Txn: <span className="font-mono">{b.upi_txn_id}</span></div>}
                 {b.razorpay_payment_id && <div className="sm:col-span-2">Payment ID: <span className="font-mono">{b.razorpay_payment_id}</span></div>}
                 {b.razorpay_order_id && <div className="sm:col-span-2">Order ID: <span className="font-mono text-[10px]">{b.razorpay_order_id}</span></div>}
                 {b.paid_at && <div className="sm:col-span-2 text-green-700">Paid at: {new Date(b.paid_at).toLocaleString("en-IN")}</div>}
                 {b.refund_id && <div className="sm:col-span-2 text-orange-700">Refund: {b.refund_id}</div>}
                 {b.special_requests && <div className="sm:col-span-2 italic">Note: {b.special_requests}</div>}
               </div>
             </div>
             <div className="flex flex-col gap-2">
               {b.payment_screenshot_url && (
                 <button onClick={() => viewScreenshot(b.payment_screenshot_url)} className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold">
                   <Eye className="h-3.5 w-3.5" /> View screenshot
                 </button>
               )}
               {b.status === "pending" && (
                 <>
                   <button onClick={() => setStatus(b.id, "approved")} className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white">
                     <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                   </button>
                   <button onClick={() => { const n = prompt("Reason (optional)") ?? undefined; setStatus(b.id, "rejected", n); }} className="inline-flex items-center justify-center gap-2 rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground">
                     <XCircle className="h-3.5 w-3.5" /> Reject
                   </button>
                 </>
               )}
               {b.status !== "pending" && (
                 <span className={`rounded-full px-3 py-1.5 text-center text-xs font-semibold capitalize ${b.status === "approved" ? "bg-green-100 text-green-800" : b.status === "refunded" ? "bg-orange-100 text-orange-800" : "bg-destructive/15 text-destructive"}`}>
                   {b.status}
                 </span>
               )}
             </div>
           </motion.div>
         ))}
       </div>}
    </div>
  );
}

function ExperiencesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const { data } = await supabase.from("experiences").select("*").order("date");
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm("Delete this experience?")) return;
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  }

  return (
    <div>
      <button onClick={() => setShowForm((s) => !s)} className="mb-5 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe">
        <Plus className="h-4 w-4" /> {showForm ? "Close form" : "New experience"}
      </button>

      {showForm && <NewExperienceForm onCreated={() => { load(); setShowForm(false); }} />}

      <div className="grid gap-3">
        {items.map((e) => (
          <div key={e.id} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 rounded-2xl bg-card p-3 shadow-card-soft">
            <img src={imageForExperience(e.image_url, e.category)} alt="" className="h-16 w-20 rounded-xl object-cover" />
            <div>
              <div className="text-display font-semibold text-ink">{e.title}</div>
              <div className="text-xs text-muted-foreground">{e.city} · ₹{e.price_inr} · {new Date(e.date).toLocaleDateString("en-IN")} · {e.is_published ? "Published" : "Draft"}</div>
            </div>
            <button onClick={() => remove(e.id)} className="grid h-9 w-9 place-items-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewExperienceForm({ onCreated }: { onCreated: () => void }) {
  const [f, setF] = useState({
    title: "", slug: "", subtitle: "", description: "",
    category: "art", date: "", location: "", city: "",
    price_inr: 999, capacity: 20, host_name: "",
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("experiences").insert({
      ...f,
      date: new Date(f.date).toISOString(),
      slug: f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    });
    setBusy(false);
    if (error) toast.error(error.message); else { toast.success("Created"); onCreated(); }
  }

  return (
    <form onSubmit={submit} className="mb-6 grid gap-3 rounded-3xl bg-card p-5 shadow-card-soft md:grid-cols-2">
      <In label="Title" value={f.title} onChange={(v) => setF({ ...f, title: v })} required />
      <In label="Slug (auto if blank)" value={f.slug} onChange={(v) => setF({ ...f, slug: v })} />
      <In label="Subtitle" value={f.subtitle} onChange={(v) => setF({ ...f, subtitle: v })} />
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
        <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm">
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
      </div>
      <In label="Date & time" type="datetime-local" value={f.date} onChange={(v) => setF({ ...f, date: v })} required />
      <In label="City" value={f.city} onChange={(v) => setF({ ...f, city: v })} required />
      <In label="Location / venue" value={f.location} onChange={(v) => setF({ ...f, location: v })} required />
      <In label="Host name" value={f.host_name} onChange={(v) => setF({ ...f, host_name: v })} />
      <In label="Price (INR)" type="number" value={String(f.price_inr)} onChange={(v) => setF({ ...f, price_inr: Number(v) })} />
      <In label="Capacity" type="number" value={String(f.capacity)} onChange={(v) => setF({ ...f, capacity: Number(v) })} />
      <div className="md:col-span-2">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
        <textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} rows={4} required className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm" />
      </div>
      <button type="submit" disabled={busy} className="md:col-span-2 rounded-full bg-rose-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-luxe disabled:opacity-60">
        {busy ? "Creating…" : "Create experience"}
      </button>
    </form>
  );
}

function In({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none" />
    </label>
  );
}
