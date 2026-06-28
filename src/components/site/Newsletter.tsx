import { ArrowRight, Sparkles } from "lucide-react";

export function Newsletter() {
  return (
    <section className="relative mt-24 overflow-hidden bg-rose-gradient py-10">
      <Sparkles className="absolute left-[10%] top-6 h-5 w-5 text-white/60 animate-sparkle" />
      <Sparkles className="absolute right-[12%] bottom-8 h-6 w-6 text-white/60 animate-sparkle" />
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:px-10">
        <div className="text-primary-foreground">
          <div className="text-display text-3xl font-semibold italic">Don't Miss Out On The Fun!</div>
          <p className="mt-1 text-sm text-primary-foreground/85">Join our community and get updates about new experiences.</p>
        </div>
        <form className="flex items-center gap-2 rounded-full bg-white/95 p-1.5 shadow-luxe">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent px-4 py-2 text-sm text-ink outline-none placeholder:text-muted-foreground"
          />
          <button className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90">
            Subscribe <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}
