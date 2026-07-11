import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({ meta: [{ title: "Signing you in… — AN Out & About" }] }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const errorDescription =
          url.searchParams.get("error_description") ||
          new URLSearchParams(url.hash.replace(/^#/, "")).get("error_description");

        if (errorDescription) throw new Error(errorDescription);

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          // Implicit flow fallback: session is auto-set from the URL hash by supabase-js.
          const { data } = await supabase.auth.getSession();
          if (!data.session) throw new Error("No session returned from provider");
        }

        toast.success("Signed in ✨");
        navigate({ to: "/experiences", replace: true });
      } catch (err: any) {
        toast.error(err?.message ?? "Sign-in failed");
        navigate({ to: "/auth", replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-hero-gradient px-6 text-center">
      <div>
        <Logo size={106} />
        <p className="mt-6 text-sm font-medium text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}
