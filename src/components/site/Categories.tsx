import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Palette, Coffee, Hammer, Users, CalendarHeart, UsersRound, LayoutGrid } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const ICONS: Record<string, any> = { Palette, Coffee, Hammer, Users, CalendarHeart, UsersRound };

export function Categories() {
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 pt-8 sm:px-6 lg:px-10 lg:pt-0">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {CATEGORIES.map((c, i) => {
          const Icon = ICONS[c.icon] ?? Palette;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col items-center gap-3 rounded-2xl bg-card p-4 text-center transition hover:-translate-y-1 hover:shadow-card-soft"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-soft/60 text-primary transition group-hover:bg-rose-gradient group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium leading-tight text-foreground">{c.label}</span>
              </Link>
            </motion.div>
          );
        })}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 }}>
          <Link to="/experiences" className="group flex flex-col items-center gap-3 rounded-2xl bg-rose-gradient p-4 text-center text-primary-foreground shadow-luxe transition hover:-translate-y-1">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
              <LayoutGrid className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold leading-tight">View All</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
