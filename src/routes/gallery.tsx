import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { GALLERY, type GalleryItem } from "@/lib/gallery-data";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Moments from AN Out & About" },
      { name: "description", content: "A curated look at our workshops, socials, and community moments across India." },
      { property: "og:title", content: "Gallery — AN Out & About" },
      { property: "og:description", content: "A curated look at our workshops, socials, and community moments." },
    ],
  }),
  component: GalleryPage,
});

const heightClass: Record<GalleryItem["height"], string> = {
  sm: "row-span-2",
  md: "row-span-3",
  lg: "row-span-4",
  xl: "row-span-5",
};

const CATS = ["All", "Art", "Food", "Workshop", "Social", "Wellness", "Music"] as const;

function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState<(typeof CATS)[number]>("All");

  const items = filter === "All" ? GALLERY : GALLERY.filter((g) => g.category === filter);

  const openAt = (id: number) => setActive(id);
  const close = () => setActive(null);
  const step = (dir: 1 | -1) => {
    if (active == null) return;
    const idx = items.findIndex((i) => i.id === active);
    const next = (idx + dir + items.length) % items.length;
    setActive(items[next].id);
  };

  const current = active != null ? items.find((i) => i.id === active) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Our Story in Pictures</div>
          <h1 className="mt-3 text-display text-5xl font-semibold italic text-ink sm:text-6xl">
            The <span className="text-primary">Gallery</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Real moments from our workshops, socials & community meetups across India.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === c ? "bg-rose-gradient text-primary-foreground shadow-luxe" : "bg-card text-ink hover:bg-rose-soft/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
        <motion.div
          layout
          className="grid auto-rows-[60px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence>
            {items.map((it, i) => (
              <motion.button
                key={it.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                whileHover={{ y: -4 }}
                onClick={() => openAt(it.id)}
                className={`group relative overflow-hidden rounded-3xl shadow-card-soft ${heightClass[it.height]}`}
              >
                <img
                  src={it.src}
                  alt={it.title}
                  loading="lazy"
                  width={1600}
                  height={1200}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-70 transition group-hover:opacity-95" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-white/80">{it.category}</div>
                  <div className="text-display text-lg font-semibold italic text-white">{it.title}</div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-white/85">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{it.location}</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{it.date}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-4 backdrop-blur-md"
            onClick={close}
          >
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-luxe"
            >
              <img src={current.src} alt={current.title} className="max-h-[70vh] w-full object-cover" />
              <div className="p-5 sm:p-6">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-primary">{current.category}</div>
                <div className="mt-1 text-display text-2xl font-semibold italic text-ink">{current.title}</div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{current.location}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{current.date}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
