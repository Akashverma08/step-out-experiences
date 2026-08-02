import { Star, Instagram, ArrowRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import g1 from "@/assets/gallery/1.jpg";
import g2 from "@/assets/gallery/43.jpg";
import g3 from "@/assets/gallery/12.jpg";
import g4 from "@/assets/gallery/16.jpg";
import g5 from "@/assets/gallery/30.jpg";
import g6 from "@/assets/gallery/34.jpg";
import g7 from "@/assets/gallery/9.jpg";
import g8 from "@/assets/gallery/29.jpg";
import g9 from "@/assets/gallery/38.jpg";

type Testimonial = {
  handle: string;
  name: string;
  avatar: string;
  photo: string;
  city: string;
  workshop: string;
  bio: string;
  interests: string[];
  quote: string;
  likes: number;
  comments: number;
};

const posts: Testimonial[] = [
  { handle: "@riya.mal", name: "Riya Malhotra", avatar: g1, photo: g3, city: "Mumbai", workshop: "Canvas Sundays", bio: "Product designer chasing softer weekends.", interests: ["Art", "Coffee", "Books"], quote: "Painted for the first time in years. Left with a canvas and three new friends.", likes: 482, comments: 34 },
  { handle: "@karan.m", name: "Karan Mehta", avatar: g6, photo: g6, city: "Bengaluru", workshop: "Acoustic Night", bio: "Backend by day, bad guitar by night.", interests: ["Music", "Coffee", "Travel"], quote: "The most beautiful little community gig I've been to.", likes: 611, comments: 52 },
  { handle: "@simran.k", name: "Simran Kaur", avatar: g4, photo: g4, city: "Delhi", workshop: "Candle Making", bio: "Making things with my hands + oat lattes.", interests: ["DIY", "Wellness", "Home"], quote: "Every candle in my apartment is now mine. Obsessed.", likes: 728, comments: 41 },
  { handle: "@ananya.d", name: "Ananya Das", avatar: g5, photo: g5, city: "Pune", workshop: "Book Club", bio: "Reader. Writer. Pretend photographer.", interests: ["Books", "Poetry", "Cinema"], quote: "Found my new favourite Sunday ritual.", likes: 394, comments: 28 },
  { handle: "@aarav.s", name: "Aarav Shah", avatar: g9, photo: g9, city: "Hyderabad", workshop: "Boozy Brunch", bio: "Consultant. Foodie. Occasional runner.", interests: ["Food", "Travel", "Wine"], quote: "Bottomless mimosas + strangers-to-friends energy.", likes: 512, comments: 47 },
  { handle: "@neha.p", name: "Neha Pillai", avatar: g8, photo: g8, city: "Goa", workshop: "Sunrise Yoga", bio: "Slow mornings, softer minds.", interests: ["Yoga", "Ocean", "Journaling"], quote: "Started my Sunday on a mat and left glowing.", likes: 856, comments: 63 },
  { handle: "@rohan.j", name: "Rohan Jain", avatar: g2, photo: g2, city: "Jaipur", workshop: "Pottery", bio: "Clay, chai, repeat.", interests: ["Ceramics", "Chai", "Design"], quote: "Two hours on the wheel felt like meditation.", likes: 289, comments: 19 },
  { handle: "@tara.b", name: "Tara Bhattacharya", avatar: g7, photo: g7, city: "Mumbai", workshop: "Picnic Social", bio: "Golden-hour chaser.", interests: ["Nature", "Music", "People"], quote: "Sunset, strangers, sandwiches. Perfect.", likes: 470, comments: 36 },
];

export function Testimonials() {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Loved By Our Community</div>
        <h2 className="mt-3 text-display text-4xl font-semibold italic text-ink sm:text-5xl">
          Real Stories. <span className="text-primary">Real Smiles.</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Tagged from Instagram — hover any card to meet the person behind the moment.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((p, i) => (
          <motion.article
            key={p.handle}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            className="group relative overflow-hidden rounded-3xl bg-card shadow-card-soft"
          >
            <div className="relative aspect-square overflow-hidden">
              <img src={p.photo} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink shadow-card-soft">
                <Instagram className="h-3 w-3 text-primary" /> {p.handle}
              </div>

              {/* Hover profile card */}
              <div className="pointer-events-none absolute inset-0 flex items-end p-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                <motion.div
                  initial={false}
                  className="glass-card w-full translate-y-3 rounded-2xl p-4 shadow-luxe transition-transform duration-500 group-hover:translate-y-0"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-white" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-ink">{p.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{p.city} · {p.workshop}</div>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-ink/80">{p.bio}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.interests.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full bg-rose-soft/60 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        <Sparkles className="h-2.5 w-2.5" /> {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="p-4">
              <p className="line-clamp-2 text-xs leading-relaxed text-ink/85">"{p.quote}"</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-primary" /> {p.likes}</span>
                  <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {p.comments}</span>
                </div>
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3 w-3 fill-current" />)}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href="https://www.instagram.com/__outandaboutevents" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-rose-gradient px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe hover:opacity-95 transition">
          <Instagram className="h-4 w-4" /> Follow @__outandaboutevents <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
