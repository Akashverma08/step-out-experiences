import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
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
      { name: "Workshops", to: "/experiences" },
      { name: "Social Gatherings", to: "/experiences" },
      { name: "All Experiences", to: "/experiences" },
    ],
  },

  {
    title: "Services",
    items: [
      { name: "Event Planning", to: "/https://wa.me/917042095024" },
      { name: "Workshops & Experiences", to: "/experiences" },
      { name: "Community Building", to: "/experiences" },
      { name: "Brand Collaborations", to: "/https://wa.me/917042095024" },
      
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
          <div className="mt-5 flex gap-3">
            <a
              href="https://www.instagram.com/__outandaboutevents"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-pink-600 hover:bg-pink-600 hover:text-white transition"
            >
              <FaInstagram className="h-5 w-5" />
            </a>

            <a
              href="https://wa.me/917042095024"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-green-600 hover:bg-green-600 hover:text-white transition"
            >
              <FaWhatsapp className="h-5 w-5" />
            </a>
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
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />  <a href="tel:+91 7042095024">

              +91 7042095024

            </a> </li>
            
            <a

              href="https://wa.me/7042095024"

              target="_blank"

              rel="noopener noreferrer"

              className="inline-flex items-center gap-2 rounded-full border 
              border-emerald-500/40 bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-100 transition"

            >

              <FaWhatsapp className="h-4 w-4" />

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
