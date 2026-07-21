import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CartRow = {
  id: string;
  user_id: string;
  experience_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export async function addToCart(experienceId: string, quantity: number): Promise<void> {
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) throw new Error("Not signed in");
  const { data: existing } = await (supabase as any)
    .from("cart_items")
    .select("id,quantity")
    .eq("user_id", uid)
    .eq("experience_id", experienceId)
    .maybeSingle();
  if (existing) {
    const next = Math.min(20, existing.quantity + quantity);
    const { error } = await (supabase as any)
      .from("cart_items")
      .update({ quantity: next })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await (supabase as any)
      .from("cart_items")
      .insert({ user_id: uid, experience_id: experienceId, quantity });
    if (error) throw error;
  }
  window.dispatchEvent(new CustomEvent("cart:changed"));
}

export async function updateCartQty(id: string, quantity: number): Promise<void> {
  if (quantity <= 0) {
    await removeFromCart(id);
    return;
  }
  const { error } = await (supabase as any)
    .from("cart_items")
    .update({ quantity: Math.min(20, quantity) })
    .eq("id", id);
  if (error) throw error;
  window.dispatchEvent(new CustomEvent("cart:changed"));
}

export async function removeFromCart(id: string): Promise<void> {
  const { error } = await (supabase as any).from("cart_items").delete().eq("id", id);
  if (error) throw error;
  window.dispatchEvent(new CustomEvent("cart:changed"));
}

export function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        if (!cancelled) setCount(0);
        return;
      }
      const { data } = await (supabase as any)
        .from("cart_items")
        .select("quantity")
        .eq("user_id", u.user.id);
      if (!cancelled) setCount((data ?? []).reduce((s: number, r: any) => s + (r.quantity ?? 0), 0));
    }
    load();
    const onChange = () => load();
    window.addEventListener("cart:changed", onChange);
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      cancelled = true;
      window.removeEventListener("cart:changed", onChange);
      sub.subscription.unsubscribe();
    };
  }, []);
  return count;
}

export const GST_RATE = 0.05;
export const PLATFORM_FEE = 49;
export const COUPONS: Record<string, number> = { WELCOME10: 10, ANOUT15: 15, FIRST20: 20 };

export function computeTotals(
  pricePerSeat: number,
  seats: number,
  couponPct = 0
) {
  const subtotal = pricePerSeat * seats;

  const discount = Math.round((subtotal * couponPct) / 100);

  const afterDiscount = subtotal - discount;

  // GST and Platform Fee removed
  const gst = 0;
  const platformFee = 0;

  const total = afterDiscount;

  return {
    subtotal,
    discount,
    gst,
    platformFee,
    total,
  };
}
