import { CheckCircle2, Play, Sparkles } from "lucide-react";
import painting from "@/assets/exp-painting.jpg";
import social from "@/assets/exp-social.jpg";
import candles from "@/assets/exp-candles.jpg";

const points = [
  { t: "Thoughtfully Curated", d: "Every detail matters" },
  { t: "Meaningful Connections", d: "Meet like-minded people" },
  { t: "Creative Expression", d: "Explore, learn & create" },
  { t: "Memories That Last", d: "Moments you'll cherish forever" },
];

export function Movement() {
  return (
    <section id="about" className="mx-auto mt-24 grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr_1fr] lg:px-10">
      <div className="relative">
        <div className="absolute -left-4 -top-6 grid h-20 w-20 place-items-center rounded-full bg-rose-gradient text-primary-foreground">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="relative grid grid-cols-2 gap-3">
          <img src={social} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-card-soft rotate-[-4deg]" />
          <img src={painting} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-card-soft translate-y-6 rotate-[3deg]" />
          <img src={candles} alt="" loading="lazy" className="col-span-2 aspect-[16/9] w-full rounded-2xl object-cover shadow-card-soft" />
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">About & Out</div>
        <h2 className="mt-3 text-display text-4xl font-semibold text-ink sm:text-5xl">
          More Than Events,
          <br />
          <span className="italic text-primary">It's a Movement.</span>
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          We believe life is better when lived beyond four walls. About & Out curates experiences that inspire you to explore, create, connect and make memories that stay with you forever.
        </p>
        <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-luxe">
          <Play className="h-4 w-4 fill-current" /> Know Our Story
        </button>
      </div>

      <ul className="space-y-5">
        {points.map((p) => (
          <li key={p.t} className="flex items-start gap-4">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div>
              <div className="text-display text-lg font-semibold text-ink">{p.t}</div>
              <div className="text-sm text-muted-foreground">{p.d}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
