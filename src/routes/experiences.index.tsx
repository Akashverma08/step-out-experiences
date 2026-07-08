import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, imageForExperience } from "@/lib/categories";

export const Route = createFileRoute("/experiences/")({
  head: () => ({
    meta: [
      { title: "All Experiences — AN Out & About" },
      { name: "description", content: "Browse all curated workshops, social mixers, and immersive experiences across Indian cities." },
      { property: "og:title", content: "All Experiences — AN Out & About" },
      { property: "og:description", content: "Curated workshops & gatherings across India." },
    ],
  }),
  component: ExperiencesPage,
});

type Exp = {
  id: string; slug: string; title: string; subtitle: string | null;
  category: string; image_url: string | null; date: string; location: string;
  city: string; price_inr: number;
};

function ExperiencesPage() {
  const [items, setItems] = useState<Exp[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    supabase
      .from("experiences")
      .select("id,slug,title,subtitle,category,image_url,date,location,city,price_inr")
      .eq("is_published", true)
      .order("date", { ascending: true })
      .then(({ data }) => {
        setItems((data as Exp[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter(
    (e) =>
      (cat === "all" || e.category === cat) &&
      (q === "" || `${e.title} ${e.city} ${e.location}`.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="bg-hero-gradient pb-10 pt-12 sm:pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Explore</div>
            <h1 className="mt-2 text-display text-5xl font-semibold leading-tight text-ink sm:text-6xl">
              Every <span className="italic text-primary">experience</span>, all in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Handpicked workshops, social gatherings, food experiences and more — curated for explorers like you.
            </p>
          </motion.div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-full bg-card px-5 py-3 shadow-card-soft">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, city or venue"
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setCat("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                cat === "all" ? "bg-rose-gradient text-primary-foreground shadow" : "bg-card text-foreground/70"
              }`}
            >All</button>
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCat(c.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  cat === c.slug ? "bg-rose-gradient text-primary-foreground shadow" : "bg-card text-foreground/70 hover:bg-rose-soft/50"
                }`}
              >{c.label}</button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-rose-soft/40" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card-soft">
            <p className="text-lg text-muted-foreground">No experiences match your filters yet. Check back soon ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
              >
                <Link
                  to="/experiences/$slug"
                  params={{ slug: e.slug }}
                  className="group block overflow-hidden rounded-3xl bg-card shadow-card-soft transition hover:-translate-y-1 hover:shadow-luxe"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={imageForExperience(e.image_url, e.category)} alt={e.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <span className="absolute left-3 top-3 rounded-full bg-rose-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-luxe">
                      {CATEGORIES.find((c) => c.slug === e.category)?.label ?? e.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-display text-xl font-semibold text-ink">{e.title}</h3>
                    {e.subtitle && <p className="mt-1 text-xs text-muted-foreground">{e.subtitle}</p>}
                    <div className="mt-4 space-y-1.5 text-xs text-foreground/80">
                      <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary" />{new Date(e.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{e.location}, {e.city}</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                      <span className="text-display text-xl font-semibold text-ink">₹{e.price_inr.toLocaleString("en-IN")}</span>
                      <span className="text-xs font-semibold text-primary group-hover:underline">View details →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
