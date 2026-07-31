import band from "@/assets/band-community.jpg";
import { Sparkles, Users, MapPin, Handshake, Calendar, Heart } from "lucide-react";

const stats = [
  { icon: Calendar, n: "15+", l: "Curated Events" },
  { icon: Users, n: "100+", l: "Community Members" },
  { icon: MapPin, n: "4+", l: "Event Locations" },
  { icon: Handshake, n: "8+", l: "Local Partners" },
];  

export function StatsBand() {
  return (
    <section className="relative mt-24 overflow-hidden">
      <div className="absolute inset-0">
        <img src={band} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/85 to-ink/70" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(({ icon: Icon, n, l }) => (
            <div key={l} className="flex items-center gap-3 text-white">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/40 text-primary"><Icon className="h-5 w-5" /></span>
              <div className="min-w-0">
                <div className="text-display text-3xl font-semibold leading-none">{n}</div>
                <div className="mt-1 text-xs text-white/70">{l}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-script text-3xl text-white/95 lg:text-right">
          Real People. <br /> Real Connections. <br /> Real Memories. <Heart className="ml-1 inline h-6 w-6 fill-primary text-primary" />
          <Sparkles className="ml-2 inline h-5 w-5 text-gold" />
        </div>
      </div>
    </section>
  );
}
