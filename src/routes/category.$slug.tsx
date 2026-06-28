import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CATEGORIES, imageForExperience } from "@/lib/categories";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} experiences — AN Out & About` },
      { name: "description", content: `Browse ${params.slug} experiences across India.` },
    ],
  }),
  component: CategoryPage,
  notFoundComponent: () => <div className="p-20 text-center">Category not found.</div>,
  errorComponent: () => <div className="p-20 text-center">Something went wrong.</div>,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const meta = CATEGORIES.find((c) => c.slug === slug);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("experiences")
      .select("id,slug,title,subtitle,category,image_url,date,location,city,price_inr")
      .eq("category", slug)
      .eq("is_published", true)
      .order("date")
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [slug]);

  if (!meta) throw notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <header className="relative overflow-hidden bg-hero-gradient pb-12 pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Link to="/experiences" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> All experiences
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-display text-5xl font-semibold leading-tight text-ink sm:text-6xl"
          >
            {meta.label} <span className="italic text-primary">collection</span>
          </motion.h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{meta.blurb}</p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-3xl bg-rose-soft/40" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card-soft">
            <p className="text-lg text-muted-foreground">No {meta.label.toLowerCase()} experiences yet — new drops every week ✨</p>
            <Link to="/experiences" className="mt-4 inline-block text-sm font-semibold text-primary">Browse all experiences →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((e: any, i: number) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link to="/experiences/$slug" params={{ slug: e.slug }} className="group block overflow-hidden rounded-3xl bg-card shadow-card-soft transition hover:-translate-y-1 hover:shadow-luxe">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={imageForExperience(e.image_url, e.category)} alt={e.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
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
                      <span className="text-xs font-semibold text-primary">View →</span>
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
