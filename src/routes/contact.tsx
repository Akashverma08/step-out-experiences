import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AN Out & About" },
      { name: "description", content: "Have a question, idea, or partnership in mind? Get in touch with the AN Out & About team." },
      { property: "og:title", content: "Contact — AN Out & About" },
      { property: "og:description", content: "Reach out to the AN Out & About team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", message: "", preferred_contact: "email" });
  const [busy, setBusy] = useState(false);

  function update<K extends keyof typeof f>(k: K, v: (typeof f)[K]) { setF((s) => ({ ...s, [k]: v })); }

  function validate(): string | null {
    if (f.name.trim().length < 2) return "Please enter your full name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return "Please enter a valid email";
    if (f.phone && !/^[+0-9 \-]{7,15}$/.test(f.phone)) return "Phone number looks invalid";
    if (f.subject.trim().length < 3) return "Please add a short subject";
    if (f.message.trim().length < 10) return "Message must be at least 10 characters";
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_queries").insert({
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone.trim() || null,
      subject: f.subject.trim(),
      message: f.message.trim(),
      preferred_contact: f.preferred_contact,
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Thanks! We'll be in touch shortly ✨");
    setF({ name: "", email: "", phone: "", subject: "", message: "", preferred_contact: "email" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="bg-hero-gradient pt-12 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Say hello</div>
            <h1 className="mt-2 text-display text-4xl font-semibold text-ink sm:text-6xl">Let's <span className="italic text-primary">talk</span>.</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">Questions, ideas, partnership requests — we read every message and reply within a day.</p>
          </motion.div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <div className="space-y-4">
          <InfoCard icon={<Mail className="h-4 w-4" />} title="Email" body="hello@anoutandabout.in" />
          <InfoCard icon={<Phone className="h-4 w-4" />} title="WhatsApp" body="+91 98765 43210" />
          <InfoCard icon={<MapPin className="h-4 w-4" />} title="Studio" body="Bandra West, Mumbai" />
          <div className="rounded-3xl bg-rose-soft/30 p-6 text-sm text-foreground/80">
            For booking-specific issues, please mention your <b>Booking ID</b> in the message. You can find it under "My Bookings".
          </div>
        </div>

        <motion.form onSubmit={submit} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid gap-4 rounded-3xl bg-card p-6 shadow-luxe sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name *"><input className="input" value={f.name} onChange={(e) => update("name", e.target.value)} /></Field>
            <Field label="Email *"><input type="email" className="input" value={f.email} onChange={(e) => update("email", e.target.value)} /></Field>
            <Field label="Phone (optional)"><input className="input" value={f.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 ..." /></Field>
            <Field label="Preferred contact">
              <select className="input" value={f.preferred_contact} onChange={(e) => update("preferred_contact", e.target.value)}>
                <option value="email">Email</option><option value="phone">Phone</option><option value="whatsapp">WhatsApp</option>
              </select>
            </Field>
          </div>
          <Field label="Subject *"><input className="input" value={f.subject} onChange={(e) => update("subject", e.target.value)} /></Field>
          <Field label="Message *"><textarea className="input" rows={6} value={f.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us what's on your mind…" /></Field>

          <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-luxe disabled:opacity-60">
            <Send className="h-4 w-4" /> {busy ? "Sending…" : "Send message"}
          </button>
        </motion.form>
      </section>
      <Footer />
      <style>{`.input{width:100%;border-radius:1rem;border:1px solid var(--border);background:var(--background);padding:.75rem 1rem;font-size:.875rem}.input:focus{outline:none;border-color:var(--primary)}`}</style>
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

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl bg-card p-5 shadow-card-soft">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-gradient text-primary-foreground">{icon}</span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{title}</div>
        <div className="mt-1 text-sm font-semibold text-ink">{body}</div>
      </div>
    </div>
  );
}
