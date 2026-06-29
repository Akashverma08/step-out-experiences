import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Sparkles, Check, ArrowLeft, Clock, Shirt, ShieldAlert, Package, ExternalLink, ChevronDown, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, imageForExperience } from "@/lib/categories";

export const Route = createFileRoute("/experiences/$slug")({
  head: () => ({
    meta: [
      { title: "Experience — AN Out & About" },
      { name: "description", content: "View experience details and book your seat." },
    ],
  }),
  component: ExperienceDetail,
  notFoundComponent: () => <div className="p-20 text-center">Experience not found.</div>,
  errorComponent: () => <div className="p-20 text-center">Something went wrong.</div>,
});

type Exp = {
  id: string; slug: string; title: string; subtitle: string | null; description: string;
  category: string; image_url: string | null; gallery: string[] | null; date: string;
  location: string; city: string; price_inr: number; capacity: number;
  host_name: string | null; host_bio: string | null;
  highlights: string[]; whats_included: string[];
  duration_minutes: number | null; map_url: string | null;
  dress_code: string | null; age_requirement: string | null;
  materials: string[] | null; faqs: { q: string; a: string }[] | null;
  cancellation_policy: string | null;
};

function ExperienceDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState<Exp | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [seatsBooked, setSeatsBooked] = useState(0);
  const [similar, setSimilar] = useState<any[]>([]);
  const [activeImg, setActiveImg] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    supabase.from("experiences").select("*").eq("slug", slug).maybeSingle().then(async ({ data }) => {
      const e = data as Exp | null;
      setExp(e);
      setLoading(false);
      if (e) {
        setActiveImg(imageForExperience(e.image_url, e.category));
        const { data: bks } = await supabase.from("bookings").select("seats").eq("experience_id", e.id).in("status", ["pending", "approved"]);
        setSeatsBooked((bks ?? []).reduce((s, b: any) => s + (b.seats ?? 0), 0));
        const { data: sims } = await supabase.from("experiences").select("id,slug,title,category,image_url,date,location,city,price_inr").eq("category", e.category).neq("id", e.id).eq("is_published", true).limit(3);
        setSimilar(sims ?? []);
      }
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl animate-pulse px-6 py-16"><div className="h-96 rounded-3xl bg-rose-soft/40" /></div>
      </div>
    );
  }
  if (!exp) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-display text-4xl font-semibold text-ink">We couldn't find that experience.</h1>
          <Link to="/experiences" className="mt-6 inline-flex items-center gap-2 text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to experiences
          </Link>
        </div>
      </div>
    );
  }

  const heroImg = imageForExperience(exp.image_url, exp.category);
  const gallery = [heroImg, ...(exp.gallery ?? []).filter(Boolean)];
  const dateStr = new Date(exp.date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" });
  const catLabel = CATEGORIES.find((c) => c.slug === exp.category)?.label ?? exp.category;
  const seatsLeft = Math.max(0, exp.capacity - seatsBooked);
  const soldOut = seatsLeft === 0;
  const mapLink = exp.map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${exp.location}, ${exp.city}`)}`;

  function handleBook() {
    if (!authed) { navigate({ to: "/auth" }); return; }
    navigate({ to: "/book/$id", params: { id: exp!.id } });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="relative">
        <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
          <motion.img key={activeImg} src={activeImg} alt={exp.title} className="h-full w-full object-cover" initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
            <Link to="/experiences" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/90 hover:text-cream">
              <ArrowLeft className="h-4 w-4" /> All experiences
            </Link>
            <span className="mt-4 inline-block rounded-full bg-rose-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-luxe">{catLabel}</span>
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-3 max-w-3xl text-display text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
              {exp.title}
            </motion.h1>
            {exp.subtitle && <p className="mt-2 text-base text-cream/85 sm:text-lg">{exp.subtitle}</p>}
          </div>
        </div>

        {gallery.length > 1 && (
          <div className="mx-auto -mt-6 flex max-w-7xl gap-3 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-10">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActiveImg(g)} className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl ring-2 transition ${activeImg === g ? "ring-primary" : "ring-transparent hover:ring-primary/40"}`}>
                <img src={g} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </motion.section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Tile icon={<Calendar className="h-4 w-4 text-primary" />} label="When" value={dateStr} />
            <Tile icon={<MapPin className="h-4 w-4 text-primary" />} label="Where" value={`${exp.location}, ${exp.city}`} />
            <Tile icon={<Users className="h-4 w-4 text-primary" />} label="Seats left" value={soldOut ? "Sold out" : `${seatsLeft} of ${exp.capacity}`} />
            <Tile icon={<Clock className="h-4 w-4 text-primary" />} label="Duration" value={exp.duration_minutes ? `${exp.duration_minutes} min` : "≈ 2 hrs"} />
          </div>

          <h2 className="mt-10 text-display text-3xl font-semibold text-ink">About this experience</h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-foreground/80">{exp.description}</p>

          {exp.highlights?.length > 0 && (
            <>
              <h3 className="mt-10 text-display text-2xl font-semibold text-ink">Highlights</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {exp.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {exp.whats_included?.length > 0 && (
            <>
              <h3 className="mt-10 text-display text-2xl font-semibold text-ink">What's included</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {exp.whats_included.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {h}
                  </li>
                ))}
              </ul>
            </>
          )}

          {(exp.materials?.length ?? 0) > 0 && (
            <>
              <h3 className="mt-10 text-display text-2xl font-semibold text-ink">Materials provided</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {exp.materials!.map((m) => (
                  <li key={m} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Package className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {m}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {exp.dress_code && (
              <InfoCard icon={<Shirt className="h-4 w-4" />} title="Dress code" body={exp.dress_code} />
            )}
            {exp.age_requirement && (
              <InfoCard icon={<ShieldAlert className="h-4 w-4" />} title="Age requirement" body={exp.age_requirement} />
            )}
          </div>

          <div className="mt-10 rounded-3xl bg-card p-6 shadow-card-soft">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-display text-2xl font-semibold text-ink">Venue & directions</h3>
              <a href={mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Open in Maps <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="mt-2 text-sm text-foreground/80">{exp.location}, {exp.city}</p>
            <iframe
              title="Map"
              loading="lazy"
              className="mt-4 h-72 w-full rounded-2xl border border-border"
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${exp.location}, ${exp.city}`)}&output=embed`}
            />
          </div>

          {exp.host_name && (
            <div className="mt-10 rounded-3xl bg-rose-soft/30 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Meet your host</div>
              <h3 className="mt-1 text-display text-2xl font-semibold text-ink">{exp.host_name}</h3>
              {exp.host_bio && <p className="mt-2 text-sm text-foreground/80">{exp.host_bio}</p>}
            </div>
          )}

          {(exp.faqs?.length ?? 0) > 0 && (
            <>
              <h3 className="mt-10 text-display text-2xl font-semibold text-ink">Frequently asked</h3>
              <div className="mt-3 divide-y divide-border rounded-3xl bg-card shadow-card-soft">
                {exp.faqs!.map((f, i) => <FAQ key={i} q={f.q} a={f.a} />)}
              </div>
            </>
          )}

          <div className="mt-10 rounded-3xl bg-card p-6 shadow-card-soft">
            <h3 className="text-display text-2xl font-semibold text-ink">Cancellation policy</h3>
            <p className="mt-2 text-sm text-foreground/80">
              {exp.cancellation_policy ?? "Free cancellation up to 48 hours before the experience. After that, refunds are at host's discretion."}
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-display text-2xl font-semibold text-ink">What explorers say</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { name: "Riya", text: "Magical evening — met some lovely people!" },
                { name: "Arjun", text: "Beautifully curated and the host was wonderful." },
              ].map((r) => (
                <div key={r.name} className="rounded-2xl bg-card p-5 shadow-card-soft">
                  <div className="flex items-center gap-1 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
                  <p className="mt-2 text-sm text-foreground/80">"{r.text}"</p>
                  <div className="mt-2 text-xs font-semibold text-ink">— {r.name}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-card p-6 shadow-luxe">
            <div className="text-display text-4xl font-semibold text-ink">
              ₹{exp.price_inr.toLocaleString("en-IN")}
              <span className="ml-1 text-sm font-medium text-muted-foreground">/ seat</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">All inclusive · GST extra if applicable</p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-soft/50 px-3 py-1 text-xs font-semibold text-primary">
              <Users className="h-3.5 w-3.5" />
              {soldOut ? "Sold out" : `${seatsLeft} seat${seatsLeft === 1 ? "" : "s"} left`}
            </div>

            <button
              onClick={handleBook}
              disabled={soldOut}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-luxe transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {soldOut ? "Sold out" : "Book Now"}
            </button>
            {!authed && !soldOut && <p className="mt-3 text-center text-xs text-muted-foreground">You'll be asked to sign in first.</p>}

            <div className="mt-6 space-y-2 text-xs text-foreground/70">
              <div>✦ Secure UPI payment with screenshot verification</div>
              <div>✦ Confirmation by our team within 12 hours</div>
              <div>✦ Free cancellation up to 48 hours before</div>
            </div>
          </div>
        </motion.aside>
      </section>

      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
          <h3 className="text-display text-3xl font-semibold text-ink">Similar experiences</h3>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <Link key={s.id} to="/experiences/$slug" params={{ slug: s.slug }} className="group block overflow-hidden rounded-3xl bg-card shadow-card-soft transition hover:-translate-y-1 hover:shadow-luxe">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={imageForExperience(s.image_url, s.category)} alt={s.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h4 className="text-display text-lg font-semibold text-ink">{s.title}</h4>
                  <div className="mt-2 text-xs text-muted-foreground">{s.city} · ₹{s.price_inr.toLocaleString("en-IN")}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card-soft">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1.5 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-card-soft">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-semibold uppercase tracking-[0.18em]">{title}</span></div>
      <p className="mt-2 text-sm text-foreground/80">{body}</p>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen((s) => !s)} className="block w-full px-5 py-4 text-left">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-primary transition ${open ? "rotate-180" : ""}`} />
      </div>
      {open && <p className="mt-2 text-sm text-foreground/75">{a}</p>}
    </button>
  );
}
