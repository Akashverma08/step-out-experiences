import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (window.location.hash.includes("access_token")) {
          // Implicit flow — supabase-js auto-detects on init; give it a tick.
          await new Promise((r) => setTimeout(r, 100));
        }
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          toast.success("Signed in ✨");
          navigate({ to: "/experiences", replace: true });
        } else {
          navigate({ to: "/auth", replace: true });
        }
      } catch (err: any) {
        toast.error(err?.message ?? "Sign-in failed");
        navigate({ to: "/auth", replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Signing you in…</p>
      </div>
    </div>
  );
}
