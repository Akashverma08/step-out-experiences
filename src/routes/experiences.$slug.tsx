import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Sparkles, Check, ArrowLeft } from "lucide-react";
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
  category: string; image_url: string | null; date: string; location: string; city: string;
  price_inr: number; capacity: number; host_name: string | null; host_bio: string | null;
  highlights: string[]; whats_included: string[];
};

function ExperienceDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [exp, setExp] = useState<Exp | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    supabase
      .from("experiences")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setExp(data as Exp | null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-6xl animate-pulse px-6 py-16">
          <div className="h-96 rounded-3xl bg-rose-soft/40" />
        </div>
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
  const dateStr = new Date(exp.date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" });
  const catLabel = CATEGORIES.find((c) => c.slug === exp.category)?.label ?? exp.category;

  function handleBook() {
    if (!authed) {
      navigate({ to: "/auth" });
      return;
    }
    navigate({ to: "/book/$id", params: { id: exp!.id } });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img src={heroImg} alt={exp.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
            <Link to="/experiences" className="inline-flex items-center gap-2 text-sm font-semibold text-cream/90 hover:text-cream">
              <ArrowLeft className="h-4 w-4" /> All experiences
            </Link>
            <span className="mt-4 inline-block rounded-full bg-rose-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-luxe">
              {catLabel}
            </span>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-3 max-w-3xl text-display text-5xl font-semibold leading-tight text-cream sm:text-6xl"
            >
              {exp.title}
            </motion.h1>
            {exp.subtitle && <p className="mt-2 text-lg text-cream/85">{exp.subtitle}</p>}
          </div>
        </div>
      </motion.section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Tile icon={<Calendar className="h-4 w-4 text-primary" />} label="When" value={dateStr} />
            <Tile icon={<MapPin className="h-4 w-4 text-primary" />} label="Where" value={`${exp.location}, ${exp.city}`} />
            <Tile icon={<Users className="h-4 w-4 text-primary" />} label="Capacity" value={`${exp.capacity} seats`} />
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

          {exp.host_name && (
            <div className="mt-10 rounded-3xl bg-rose-soft/30 p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Meet your host</div>
              <h3 className="mt-1 text-display text-2xl font-semibold text-ink">{exp.host_name}</h3>
              {exp.host_bio && <p className="mt-2 text-sm text-foreground/80">{exp.host_bio}</p>}
            </div>
          )}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="rounded-3xl bg-card p-6 shadow-luxe">
            <div className="text-display text-4xl font-semibold text-ink">
              ₹{exp.price_inr.toLocaleString("en-IN")}
              <span className="ml-1 text-sm font-medium text-muted-foreground">/ seat</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">All inclusive · GST extra if applicable</p>

            <button
              onClick={handleBook}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-luxe transition hover:opacity-95"
            >
              Reserve your seat
            </button>
            {!authed && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                You'll be asked to sign in first.
              </p>
            )}

            <div className="mt-6 space-y-2 text-xs text-foreground/70">
              <div>✦ Secure UPI payment with screenshot verification</div>
              <div>✦ Confirmation by our team within 12 hours</div>
              <div>✦ Free cancellation up to 48 hours before</div>
            </div>
          </div>
        </motion.aside>
      </section>

      <Footer />
    </div>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card-soft">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-1.5 text-sm font-semibold text-ink">{value}</div>
    </div>
  );
}
