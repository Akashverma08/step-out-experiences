import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, ShoppingBag, UserRound, LogOut, ShieldCheck, Calendar } from "lucide-react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/lib/categories";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  const link = "text-sm font-medium text-foreground/80 hover:text-primary transition-colors";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/60" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <Logo size={56} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          <Link to="/" className={link} activeProps={{ className: "text-primary" }}>Home</Link>
          <Link to="/experiences" className={link} activeProps={{ className: "text-primary" }}>Experiences</Link>
          <button
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            className={`${link} relative flex items-center gap-1`}
          >
            Categories <ChevronDown className="h-4 w-4" />
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full z-50 mt-3 w-[680px] -translate-x-1/2 rounded-3xl glass-card p-6 shadow-luxe"
                >
                  <div className="grid grid-cols-2 gap-4 text-left">
                    {CATEGORIES.map((c) => (
                      <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group flex items-start gap-3 rounded-2xl p-2 hover:bg-rose-soft/40">
                        <img src={c.img} alt="" className="h-12 w-12 rounded-xl object-cover" />
                        <div>
                          <div className="text-sm font-semibold text-ink group-hover:text-primary">{c.label}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{c.blurb}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-border/60 pt-4 text-right">
                    <Link to="/experiences" className="text-sm font-semibold text-primary">View All Experiences →</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          <Link to="/contact" className={link} activeProps={{ className: "text-primary" }}>Contact</Link>
          {user && <Link to="/my-bookings" className={link} activeProps={{ className: "text-primary" }}>My Bookings</Link>}
          {isAdmin && <Link to="/admin" className={`${link} inline-flex items-center gap-1`} activeProps={{ className: "text-primary" }}><ShieldCheck className="h-4 w-4" /> Admin</Link>}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen((s) => !s)} className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-semibold text-ink shadow-card-soft hover:bg-rose-soft/40">
                <UserRound className="h-4 w-4 text-primary" />
                <span className="hidden max-w-[120px] truncate sm:inline">{user.email}</span>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl bg-card shadow-luxe">
                    <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-rose-soft/40">
                      <Calendar className="h-4 w-4 text-primary" /> My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-rose-soft/40">
                        <ShieldCheck className="h-4 w-4 text-primary" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={signOut} className="flex w-full items-center gap-2 border-t border-border/60 px-4 py-3 text-sm text-destructive hover:bg-destructive/10">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/auth" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe hover:opacity-95 transition">
              <UserRound className="h-4 w-4" /> Login / Signup
            </Link>
          )}
          <Link to="/experiences" className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card hover:bg-accent transition">
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
