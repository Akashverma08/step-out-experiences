import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Heart, MapPin, Calendar } from "lucide-react";
import painting from "@/assets/exp-painting.jpg";
import food from "@/assets/exp-food.jpg";
import social from "@/assets/exp-social.jpg";
import candles from "@/assets/exp-candles.jpg";
import { motion } from "framer-motion";

const experiences = [
  { slug: "canvas-and-conversations", img: painting, badge: "Art & Creativity", title: "Canvas & Conversations", sub: "Sip · Paint · Connect", date: "18 Jul, 2026 · 4:00 PM", loc: "The Art Studio, Mumbai", price: "₹1,499" },
  { slug: "pizza-and-playlist-night", img: food, badge: "Food & Drinks", title: "Pizza & Playlist Night", sub: "Food · Music · Games", date: "19 Jul, 2026 · 7:00 PM", loc: "The Rolling Table, Pune", price: "₹1,299" },
  { slug: "talks-tacos-and-people", img: social, badge: "Social Gathering", title: "Talks, Tacos & People", sub: "Meet · Mingle · Make Friends", date: "20 Jul, 2026 · 6:00 PM", loc: "Popup Café, Bangalore", price: "₹999" },
  { slug: "candle-making-workshop", img: candles, badge: "DIY Workshops", title: "Candle Making Workshop", sub: "Create · Relax · Unwind", date: "21 Jul, 2026 · 11:00 AM", loc: "Studio Bloom, Delhi", price: "₹1,199" },
];

export function Featured() {
  return (
    <section id="experiences" className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Explore Popular Experiences</div>
          <h2 className="mt-2 text-display text-4xl font-semibold text-ink sm:text-5xl">
            Something for <span className="italic text-primary">Every Explorer</span>
          </h2>
        </div>
        <Link to="/experiences" className="hidden items-center gap-2 text-sm font-semibold text-primary sm:inline-flex">
          View All Experiences <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative mt-8">
        <button className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-card shadow-card-soft hover:bg-rose-soft sm:grid">
          <ArrowLeft className="h-4 w-4 text-primary" />
        </button>
        <button className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-card shadow-card-soft hover:bg-rose-soft sm:grid">
          <ArrowRight className="h-4 w-4 text-primary" />
        </button>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {experiences.map((e, i) => (
            <motion.article
              key={e.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group overflow-hidden rounded-3xl bg-card shadow-card-soft transition hover:-translate-y-1 hover:shadow-luxe"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={e.img} alt={e.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <span className="absolute left-3 top-3 rounded-full bg-rose-gradient px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-luxe">
                  {e.badge}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-display text-xl font-semibold text-ink">{e.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{e.sub}</p>
                <div className="mt-4 space-y-1.5 text-xs text-foreground/80">
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-primary" />{e.date}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{e.loc}</div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="text-display text-xl font-semibold text-ink">{e.price}</span>
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-rose-soft/60 text-primary transition hover:bg-rose-gradient hover:text-primary-foreground">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
