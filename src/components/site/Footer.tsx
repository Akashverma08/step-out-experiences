import { Facebook, Instagram, Youtube, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";

const cols = [
  { title: "Quick Links", items: ["Home", "About Us", "Experiences", "Services", "Contact Us"] },
  { title: "Experiences", items: ["Art & Creativity", "Food & Drinks", "Workshops", "Social Gatherings", "All Experiences"] },
  { title: "Services", items: ["Event Planning", "Workshops & Experiences", "Community Building", "Brand Collaborations", "Private Events"] },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-cream pt-16 pb-6">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_repeat(4,1fr)] lg:px-10">
        <div>
          <Logo size={72} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Creating meaningful experiences that bring people together, inspire creativity, and create stories worth remembering.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Youtube, MessageCircle].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-foreground/70 hover:bg-rose-gradient hover:text-primary-foreground transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">{c.title}</div>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {c.items.map((i) => <li key={i} className="hover:text-primary cursor-pointer transition">{i}</li>)}
            </ul>
          </div>
        ))}

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Contact Us</div>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Mumbai, India</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@anoutandabout.com</li>
            <li className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-emerald-700">
              <MessageCircle className="h-3.5 w-3.5" /> Chat on WhatsApp
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border/60 px-4 pt-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-10">
        <div>© 2026 AN Out & About Events & Experiences. All Rights Reserved.</div>
        <div className="flex gap-5">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}
