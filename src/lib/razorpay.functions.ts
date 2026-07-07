import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createHmac, timingSafeEqual } from "node:crypto";

// Public key id — safe to expose to browser
export const getRazorpayKeyId = createServerFn({ method: "GET" }).handler(async () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("Razorpay not configured");
  return { keyId };
});

type BillingInput = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

type AttendeeInput = {
  age: number;
  date_of_birth: string;
  gender: string;
  emergency_contact?: string;
  special_requests?: string;
};

type CreateOrderInput = {
  experienceId: string;
  seats: number;
  couponCode?: string | null;
  billing: BillingInput;
  attendee: AttendeeInput;
  terms_accepted: boolean;
};

const COUPONS: Record<string, number> = { WELCOME10: 10, ANOUT15: 15, FIRST20: 20 };
const GST_RATE = 0.05;
const PLATFORM_FEE = 49;

function computeTotals(price: number, seats: number, pct: number) {
  const subtotal = price * seats;
  const discount = Math.round((subtotal * pct) / 100);
  const afterDiscount = subtotal - discount;
  const gst = Math.round(afterDiscount * GST_RATE);
  const total = afterDiscount + gst + PLATFORM_FEE;
  return { subtotal, discount, gst, platformFee: PLATFORM_FEE, total };
}

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CreateOrderInput) => input)
  .handler(async ({ data, context }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new Error("Razorpay not configured");

    if (!data.terms_accepted) throw new Error("Please accept the terms & conditions");
    if (!data.billing?.name || !data.billing?.email || !data.billing?.phone) {
      throw new Error("Missing billing details");
    }
    if (!data.seats || data.seats < 1) throw new Error("Invalid seat count");

    const { supabase, userId } = context;
    const { data: exp, error: expErr } = await supabase
      .from("experiences")
      .select("id,title,price_inr,capacity,is_published")
      .eq("id", data.experienceId)
      .maybeSingle();
    if (expErr || !exp) throw new Error("Experience not found");

    // seats availability
    const { data: seatsLeftData } = await supabase.rpc("seats_left", { _experience_id: exp.id });
    const seatsLeft = Number(seatsLeftData ?? 0);
    if (seatsLeft < data.seats) throw new Error(`Only ${seatsLeft} seats left`);

    const pct = data.couponCode ? (COUPONS[data.couponCode.toUpperCase()] ?? 0) : 0;
    const totals = computeTotals(exp.price_inr, data.seats, pct);

    // Insert booking with pending status + razorpay method
    const { data: booking, error: insErr } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        experience_id: exp.id,
        seats: data.seats,
        amount_inr: totals.total,
        gst_inr: totals.gst,
        platform_fee_inr: totals.platformFee,
        discount_inr: totals.discount,
        coupon_code: pct ? data.couponCode!.toUpperCase() : null,
        contact_name: data.billing.name,
        contact_email: data.billing.email,
        contact_phone: data.billing.phone,
        age: data.attendee.age,
        date_of_birth: data.attendee.date_of_birth,
        gender: data.attendee.gender,
        city: data.billing.city ?? null,
        emergency_contact: data.attendee.emergency_contact ?? null,
        special_requests: data.attendee.special_requests ?? null,
        terms_accepted: true,
        billing_address: data.billing.address ?? null,
        billing_state: data.billing.state ?? null,
        billing_pincode: data.billing.pincode ?? null,
        payment_method: "razorpay",
        status: "pending",
      })
      .select("id,booking_number")
      .single();
    if (insErr || !booking) throw new Error(insErr?.message ?? "Could not create booking");

    // Create Razorpay order
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: totals.total * 100,
        currency: "INR",
        receipt: booking.booking_number ?? booking.id,
        notes: {
          booking_id: booking.id,
          experience_id: exp.id,
          user_id: userId,
        },
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      await supabase.from("bookings").update({ status: "failed", admin_note: `Order create failed: ${err.slice(0, 200)}` }).eq("id", booking.id);
      throw new Error(`Razorpay error: ${err.slice(0, 200)}`);
    }
    const order = (await res.json()) as { id: string; amount: number; currency: string };

    await supabase.from("bookings").update({ razorpay_order_id: order.id }).eq("id", booking.id);

    return {
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking.id,
      bookingNumber: booking.booking_number,
    };
  });

type VerifyInput = {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: VerifyInput) => input)
  .handler(async ({ data, context }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay not configured");
    const { supabase, userId } = context;

    const payload = `${data.razorpay_order_id}|${data.razorpay_payment_id}`;
    const expected = createHmac("sha256", keySecret).update(payload).digest("hex");
    const sigBuf = Buffer.from(data.razorpay_signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      await supabase.from("bookings").update({ status: "failed", admin_note: "Signature mismatch" }).eq("id", data.bookingId).eq("user_id", userId);
      throw new Error("Payment signature invalid");
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .update({
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        status: "approved",
        paid_at: new Date().toISOString(),
      })
      .eq("id", data.bookingId)
      .eq("user_id", userId)
      .eq("razorpay_order_id", data.razorpay_order_id)
      .select("id,experience_id,booking_number")
      .single();
    if (error || !booking) throw new Error(error?.message ?? "Booking not found");

    // Clear cart for this experience
    await supabase.from("cart_items").delete().eq("user_id", userId).eq("experience_id", booking.experience_id);

    return { bookingId: booking.id, bookingNumber: booking.booking_number };
  });
