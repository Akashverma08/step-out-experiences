import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/site/Navbar";

export const Route = createFileRoute("/claim-admin")({
  component: ClaimAdmin,
});

function ClaimAdmin() {
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function claim() {
    setBusy(true);
    const { data, error } = await supabase.rpc("claim_admin_if_first");
    setBusy(false);
    if (error) { setStatus("error: " + error.message); return; }
    setStatus(String(data));
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) setStatus("not_signed_in");
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-xl px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-card p-8 shadow-luxe text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-display text-3xl font-semibold text-ink">Claim admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One-time setup. Only works if no admin exists yet. After this, manage experiences and approve bookings from the Admin panel.
          </p>

          {status === "not_signed_in" && (
            <Link to="/auth" className="mt-6 inline-flex rounded-full bg-rose-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-luxe">Sign in first</Link>
          )}
          {status !== "not_signed_in" && (
            <button onClick={claim} disabled={busy} className="mt-6 inline-flex rounded-full bg-rose-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-luxe disabled:opacity-60">
              {busy ? "Claiming…" : "Claim admin"}
            </button>
          )}

          {status === "granted" && <div className="mt-4 rounded-2xl bg-green-100 p-3 text-sm text-green-800">✓ You are now an admin. <Link to="/admin" className="font-semibold underline">Open Admin Panel</Link></div>}
          {status === "already_admin" && <div className="mt-4 rounded-2xl bg-rose-soft/40 p-3 text-sm">You already have admin access. <Link to="/admin" className="font-semibold text-primary underline">Open Admin Panel</Link></div>}
          {status === "admin_already_set" && <div className="mt-4 rounded-2xl bg-destructive/10 p-3 text-sm text-destructive">An admin already exists. Ask them to grant you access.</div>}
        </motion.div>
      </div>
    </div>
  );
}
