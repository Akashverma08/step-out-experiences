
CREATE OR REPLACE FUNCTION public.claim_admin_if_first()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_count INT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN 'not_signed_in';
  END IF;
  SELECT COUNT(*) INTO v_count FROM public.user_roles WHERE role = 'admin';
  IF v_count > 0 THEN
    -- if caller is already admin, ok
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_uid AND role = 'admin') THEN
      RETURN 'already_admin';
    END IF;
    RETURN 'admin_already_set';
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (v_uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN 'granted';
END;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_admin_if_first() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin_if_first() TO authenticated;
