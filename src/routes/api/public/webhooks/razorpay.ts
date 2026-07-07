import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";

export const Route = createFileRoute("/api/public/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
          console.error("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET not configured");
          return new Response("Not configured", { status: 503 });
        }
        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const raw = await request.text();
        const expected = createHmac("sha256", secret).update(raw).digest("hex");
        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expected);
        if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: any;
        try {
          event = JSON.parse(raw);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        try {
          const type = event?.event as string;
          const payment = event?.payload?.payment?.entity;
          const refund = event?.payload?.refund?.entity;

          if (type === "payment.captured" || type === "payment.authorized") {
            const orderId = payment?.order_id;
            const paymentId = payment?.id;
            if (orderId && paymentId) {
              await supabaseAdmin
                .from("bookings")
                .update({
                  status: "approved",
                  razorpay_payment_id: paymentId,
                  paid_at: new Date().toISOString(),
                })
                .eq("razorpay_order_id", orderId)
                .neq("status", "approved");
            }
          } else if (type === "payment.failed") {
            const orderId = payment?.order_id;
            if (orderId) {
              await supabaseAdmin
                .from("bookings")
                .update({
                  status: "failed",
                  admin_note: `Payment failed: ${payment?.error_description ?? "unknown"}`,
                })
                .eq("razorpay_order_id", orderId)
                .eq("status", "pending");
            }
          } else if (type === "refund.created" || type === "refund.processed") {
            const paymentId = refund?.payment_id;
            const refundId = refund?.id;
            if (paymentId && refundId) {
              await supabaseAdmin
                .from("bookings")
                .update({
                  status: "refunded",
                  refund_id: refundId,
                  refunded_at: new Date().toISOString(),
                })
                .eq("razorpay_payment_id", paymentId);
            }
          }
        } catch (err) {
          console.error("[razorpay-webhook] handler error", err);
          return new Response("error", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
      GET: async () => new Response("ok"),
    },
  },
});
