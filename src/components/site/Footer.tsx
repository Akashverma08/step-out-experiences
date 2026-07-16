import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Quick Links",
    items: [
      { name: "Home", to: "/" },
      { name: "About Us", to: "/" },
      { name: "Experiences", to: "/experiences" },
      { name: "Contact Us", to: "/contact" },
    ],
  },

  {
    title: "Experiences",
    items: [
      { name: "Art & Creativity", to: "/category/art" },
      { name: "Food & Drinks", to: "/category/food" },
      { name: "Workshops", to: "/experiences"},
      { name: "Social Gatherings", to: "/experiences"},
      { name: "All Experiences", to: "/experiences" },
    ],
  },

  {
    title: "Services",
    items: [
      { name: "Event Planning", to: "/contact"},
      { name: "Workshops & Experiences", to: "/experiences"},
      { name: "Community Building", to: "/experiences"},
      { name: "Brand Collaborations", to: "/contact"},
      { name: "Private Events", to: "/contact"}
    ],
  },
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
              {c.items.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="transition hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">Contact Us</div>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Delhi,India </li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />  <a href="tel:+91 84486 63421">

              +91 84486 63421

            </a> </li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href="mailto:akashverma0401@gmail.com">

              hello@ANoutandabout.com

            </a> </li>
            <a

              href="https://wa.me/8448663421"

              target="_blank"

              rel="noopener noreferrer"

              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-100 transition"

            >

              <MessageCircle className="h-3.5 w-3.5" />

              Chat on WhatsApp

            </a>
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
