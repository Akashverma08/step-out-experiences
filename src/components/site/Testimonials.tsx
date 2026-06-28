import { Star, Instagram, ArrowRight } from "lucide-react";
import social from "@/assets/exp-social.jpg";
import painting from "@/assets/exp-painting.jpg";
import candles from "@/assets/exp-candles.jpg";
import food from "@/assets/exp-food.jpg";
import hero from "@/assets/hero-friends.jpg";

const reviews = [
  { name: "Riya Malhotra", quote: "The painting workshop was so therapeutic and fun. Met amazing people!" },
  { name: "Karan Mehta", quote: "One of the most beautiful community events I've attended. Super organized!" },
  { name: "Simran Kaur", quote: "Great vibes, great people, and such a creative experience!" },
];

const grid = [social, painting, candles, food, hero, social, painting, candles];

export function Testimonials() {
  return (
    <section className="mx-auto mt-24 grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-10">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Loved By Our Community</div>
        <h2 className="mt-3 text-display text-4xl font-semibold text-ink italic sm:text-5xl">
          Real Stories. Real Smiles.
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="rounded-2xl bg-card p-5 shadow-card-soft">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-rose-soft" />
                <div className="text-sm font-semibold text-ink">{r.name}</div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">"{r.quote}"</p>
              <div className="mt-3 flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Follow Our Journey</div>
        <h2 className="mt-3 text-display text-3xl font-semibold italic text-primary">@an.outandabout.events</h2>
        <div className="mt-6 grid grid-cols-4 gap-2">
          {grid.map((img, i) => (
            <a key={i} href="#" className="group relative aspect-square overflow-hidden rounded-xl">
              <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-ink/0 opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
                <Instagram className="h-5 w-5 text-white" />
              </div>
            </a>
          ))}
        </div>
        <a href="#" className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition">
          Follow Us on Instagram <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}
