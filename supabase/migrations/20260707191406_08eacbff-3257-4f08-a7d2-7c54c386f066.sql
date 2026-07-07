
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS razorpay_order_id text,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
  ADD COLUMN IF NOT EXISTS razorpay_signature text,
  ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'upi_manual',
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS refund_id text,
  ADD COLUMN IF NOT EXISTS refunded_at timestamptz;

CREATE INDEX IF NOT EXISTS bookings_razorpay_order_idx ON public.bookings(razorpay_order_id);
CREATE INDEX IF NOT EXISTS bookings_razorpay_payment_idx ON public.bookings(razorpay_payment_id);

-- Allow status refunded/failed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='refunded' AND enumtypid=(SELECT oid FROM pg_type WHERE typname='booking_status')) THEN
    ALTER TYPE public.booking_status ADD VALUE 'refunded';
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel='failed' AND enumtypid=(SELECT oid FROM pg_type WHERE typname='booking_status')) THEN
    ALTER TYPE public.booking_status ADD VALUE 'failed';
  END IF;
END $$;
