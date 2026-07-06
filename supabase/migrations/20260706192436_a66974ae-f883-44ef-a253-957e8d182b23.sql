
-- Cart
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0 AND quantity <= 20),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, experience_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all carts" ON public.cart_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_cart_updated BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Booking number sequence + column
CREATE SEQUENCE IF NOT EXISTS public.booking_number_seq START 1;
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS booking_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS billing_address text,
  ADD COLUMN IF NOT EXISTS billing_state text,
  ADD COLUMN IF NOT EXISTS billing_pincode text,
  ADD COLUMN IF NOT EXISTS gst_inr integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_fee_inr integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_inr integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS coupon_code text;

CREATE OR REPLACE FUNCTION public.set_booking_number()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := 'BK' || to_char(now(), 'YYYY') ||
      lpad(nextval('public.booking_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_booking_number ON public.bookings;
CREATE TRIGGER trg_booking_number BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_booking_number();

-- Backfill existing rows
UPDATE public.bookings
SET booking_number = 'BK' || to_char(created_at, 'YYYY') ||
  lpad(nextval('public.booking_number_seq')::text, 6, '0')
WHERE booking_number IS NULL;

-- Seats-left helper
CREATE OR REPLACE FUNCTION public.seats_left(_experience_id uuid)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT GREATEST(0,
    (SELECT capacity FROM public.experiences WHERE id = _experience_id) -
    COALESCE((SELECT SUM(seats) FROM public.bookings
      WHERE experience_id = _experience_id
        AND status IN ('pending','approved')), 0)
  )::int;
$$;
GRANT EXECUTE ON FUNCTION public.seats_left(uuid) TO anon, authenticated;
