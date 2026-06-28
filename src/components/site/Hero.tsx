import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Heart } from "lucide-react";
import heroImg from "@/assets/hero-friends.jpg";
import painting from "@/assets/exp-painting.jpg";
import social from "@/assets/exp-social.jpg";
import food from "@/assets/exp-food.jpg";
import candles from "@/assets/exp-candles.jpg";
import { Logo } from "./Logo";

const sideCards = [
  { img: painting, title: "Creative", sub: "Workshops" },
  { img: social, title: "Social", sub: "Gatherings" },
  { img: food, title: "Food &", sub: "Experiences" },
  { img: candles, title: "Community", sub: "Meetups" },
];

const stats = [
  { n: "200+", l: "Experiences Hosted" },
  { n: "5000+", l: "Happy Explorers" },
  { n: "25+", l: "Cities Covered" },
  { n: "50+", l: "Community Partners" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-6 pb-20">
      {/* sparkles */}
      <Sparkles className="absolute left-[8%] top-[35%] h-4 w-4 text-gold animate-sparkle" />
      <Sparkles className="absolute right-[42%] top-[20%] h-5 w-5 text-rose animate-sparkle" style={{ animationDelay: "1.2s" }} />
      <Sparkles className="absolute left-[44%] bottom-[18%] h-3 w-3 text-gold animate-sparkle" style={{ animationDelay: "2s" }} />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="flex items-center gap-2 text-script text-2xl text-primary">
            Step Out. Experience More. <Heart className="h-5 w-5 fill-primary text-primary" />
          </div>
          <h1 className="mt-4 text-display text-5xl leading-[1.05] font-semibold text-ink sm:text-6xl lg:text-7xl">
            Life Gets Better
            <br />
            <span className="text-primary italic">When You Step Out.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Curated workshops, social gatherings & immersive experiences that turn ordinary days into unforgettable memories.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="group inline-flex items-center gap-2 rounded-full bg-rose-gradient px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-luxe transition hover:scale-[1.02]">
              Explore Experiences
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center gap-3 text-sm font-semibold text-ink">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-gradient text-primary-foreground shadow-luxe">
                <Play className="h-4 w-4 fill-current" />
              </span>
              Watch Our Story
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="text-display text-3xl font-semibold text-ink">{s.n}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right side: hero image + floating logo + side cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative"
        >
          <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] shadow-luxe">
            <img src={heroImg} alt="Friends gathering at a candle-lit experience" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-transparent" />
          </div>

          {/* floating circular logo */}
          <div className="animate-float absolute -bottom-6 left-1/2 -translate-x-1/2">
            <Logo size={128} className="ring-8 ring-background" />
          </div>

          {/* side category cards */}
          <div className="absolute -right-4 top-4 hidden flex-col gap-3 sm:flex">
            {sideCards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex w-56 items-center gap-3 rounded-2xl glass-card p-2 shadow-card-soft"
              >
                <img src={c.img} alt="" className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold leading-tight text-ink">
                    {c.title}
                    <br />
                    {c.sub}
                  </div>
                  <div className="text-xs font-semibold text-primary">Explore →</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
