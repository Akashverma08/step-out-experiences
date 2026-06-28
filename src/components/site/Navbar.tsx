import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, ShoppingBag, UserRound } from "lucide-react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

const megaCategories = [
  { title: "Art & Creativity", items: ["Painting", "Pottery", "Craft Workshops", "Artist Sessions"] },
  { title: "Food & Drinks", items: ["Coffee Experiences", "Pizza Nights", "Tasting Tables"] },
  { title: "Social & Community", items: ["Meetups", "Games Night", "Book Clubs", "Networking"] },
  { title: "Seasonal & Kids", items: ["Diwali", "Christmas", "Holi", "Kids Activities"] },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = "text-sm font-medium text-foreground/80 hover:text-primary transition-colors";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={56} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link to="/" className={link} activeProps={{ className: "text-primary" }}>Home</Link>
          <a href="#about" className={link}>About Us</a>
          <button
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className={`${link} relative flex items-center gap-1`}
          >
            Experiences <ChevronDown className="h-4 w-4" />
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full z-50 mt-3 w-[680px] -translate-x-1/2 rounded-3xl glass-card p-6 shadow-luxe"
                >
                  <div className="grid grid-cols-2 gap-6 text-left">
                    {megaCategories.map((c) => (
                      <div key={c.title}>
                        <div className="text-xs uppercase tracking-[0.18em] text-primary/80">{c.title}</div>
                        <ul className="mt-3 space-y-1.5">
                          {c.items.map((i) => (
                            <li key={i} className="text-sm text-foreground/80 hover:text-primary cursor-pointer transition-colors">
                              {i}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-border/60 pt-4 text-right">
                    <a href="#experiences" className="text-sm font-semibold text-primary">View All Experiences →</a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <a href="#services" className={link}>Services</a>
          <a href="#contact" className={link}>Contact Us</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex items-center gap-2 rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe hover:opacity-95 transition">
            <UserRound className="h-4 w-4" /> Login / Signup
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent transition">
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
