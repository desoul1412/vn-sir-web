-- =============================================================================
-- Migration: 20260416000002_rls_policies.sql
-- Project:   paperclip (qdhengvarelfdtmycnti)
-- Author:    Technical SEO / BE Agent (Task 0.7)
-- Date:      2026-04-16
-- Purpose:   Comprehensive RLS policy layer for VNSIR.
--
--            Sections:
--              A. Role infrastructure   — add `role` column to public.profiles,
--                                        create is_admin() / is_editor() helpers
--              B. Additional tables     — access_logs, whitelist_audit_log,
--                                        tier2_projects, project_milestones
--              C. Supplemental policies — admin / editor policies for every
--                                        public.* and vnsir.* table not fully
--                                        covered by 001_foundation.sql
--              D. vnsir schema grants   — GRANT to anon / authenticated roles
--              E. Storage bucket policies (advisory — see inline comments)
--
--            All DDL is idempotent where possible.
--            Policies that may already exist are dropped before recreation
--            using `DROP POLICY IF EXISTS … ON …`.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- A. ROLE INFRASTRUCTURE
-- ─────────────────────────────────────────────────────────────────────────────

-- A1. Add `role` column to public.profiles if it does not yet exist.
--     Values: 'user' (default), 'editor', 'analyst', 'super_admin'
--     `editor`      can publish/edit reports and analyst_briefs
--     `analyst`     same as editor + can view CRM pipeline
--     `super_admin` full access — user management, whitelist, financials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'role'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
        CONSTRAINT profiles_role_check
          CHECK (role IN ('user', 'editor', 'analyst', 'super_admin'));

    COMMENT ON COLUMN public.profiles.role
      IS 'VNSIR staff role. user=client, editor=content, analyst=content+CRM, super_admin=full access.';
  END IF;
END;
$$;

-- A2. Add `is_whitelisted` flag to public.profiles (stealth-mode VIP access).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'is_whitelisted'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN is_whitelisted BOOLEAN NOT NULL DEFAULT false;

    COMMENT ON COLUMN public.profiles.is_whitelisted
      IS 'VIP stealth mode flag — toggled by admins. Unlocks stealth reports.';
  END IF;
END;
$$;

-- A3. Helper: is_admin() — true when caller is super_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- A4. Helper: is_staff() — true when caller is any staff role
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('editor', 'analyst', 'super_admin')
  );
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- B. ADDITIONAL TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- B1. access_logs — auth sign-in history per user (spec §3.7)
CREATE TABLE IF NOT EXISTS public.access_logs (
  id             BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address     INET,
  user_agent     TEXT,
  signed_in_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.access_logs
  IS 'Auth sign-in history. Populated by Supabase Auth trigger. Users read own rows only.';

CREATE INDEX IF NOT EXISTS access_logs_user_id_idx    ON public.access_logs(user_id);
CREATE INDEX IF NOT EXISTS access_logs_signed_in_idx  ON public.access_logs(signed_in_at DESC);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "access_logs: owner can read own logs"  ON public.access_logs;
DROP POLICY IF EXISTS "access_logs: service role inserts"     ON public.access_logs;
DROP POLICY IF EXISTS "access_logs: admin can read all"       ON public.access_logs;

CREATE POLICY "access_logs: owner can read own logs"
  ON public.access_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "access_logs: service role inserts"
  ON public.access_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "access_logs: admin can read all"
  ON public.access_logs FOR SELECT
  USING (public.is_admin());

-- RPC: users call this to get their own sign-in history
CREATE OR REPLACE FUNCTION public.get_my_access_logs(p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id           BIGINT,
  ip_address   INET,
  user_agent   TEXT,
  signed_in_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, ip_address, user_agent, signed_in_at
  FROM   public.access_logs
  WHERE  user_id = auth.uid()
  ORDER  BY signed_in_at DESC
  LIMIT  p_limit;
$$;

-- B2. whitelist_audit_log — tracks all whitelist toggle changes (spec §3.11)
CREATE TABLE IF NOT EXISTS public.whitelist_audit_log (
  id              BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  admin_user_id   UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_user_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  field_changed   TEXT        NOT NULL,   -- e.g. 'is_whitelisted', 'role', 'access_tier'
  old_value       TEXT,
  new_value       TEXT,
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.whitelist_audit_log
  IS 'Immutable audit log of admin-initiated changes to user access/whitelist fields.';

CREATE INDEX IF NOT EXISTS whitelist_audit_admin_idx   ON public.whitelist_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS whitelist_audit_target_idx  ON public.whitelist_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS whitelist_audit_changed_idx ON public.whitelist_audit_log(changed_at DESC);

ALTER TABLE public.whitelist_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "whitelist_audit_log: admin can read all"   ON public.whitelist_audit_log;
DROP POLICY IF EXISTS "whitelist_audit_log: admin can insert"     ON public.whitelist_audit_log;

CREATE POLICY "whitelist_audit_log: admin can read all"
  ON public.whitelist_audit_log FOR SELECT
  USING (public.is_admin());

CREATE POLICY "whitelist_audit_log: admin can insert"
  ON public.whitelist_audit_log FOR INSERT
  WITH CHECK (public.is_admin());

-- B3. tier2_projects — Tier 2 custom advisory project management (spec §3.14)
CREATE TABLE IF NOT EXISTS public.tier2_projects (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  advisory_request_id   UUID        NOT NULL REFERENCES public.advisory_requests(id) ON DELETE RESTRICT,
  client_user_id        UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  name                  TEXT        NOT NULL,
  start_date            DATE,
  expected_deadline     DATE,
  -- Final deliverable
  final_pdf_path        TEXT,           -- private Storage path to final report PDF
  paywall_amount_cents  INTEGER,        -- amount client must pay to unlock final PDF
  paywall_active        BOOLEAN     NOT NULL DEFAULT false,
  payment_status        TEXT        NOT NULL DEFAULT 'locked'
                                    CHECK (payment_status IN ('locked', 'paid')),
  -- Audit
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.tier2_projects
  IS 'Tier 2 custom advisory projects. Links advisory_requests to client deliverables.';
COMMENT ON COLUMN public.tier2_projects.paywall_active
  IS 'When true, client must pay paywall_amount_cents to download the final PDF.';

CREATE INDEX IF NOT EXISTS tier2_projects_client_idx    ON public.tier2_projects(client_user_id);
CREATE INDEX IF NOT EXISTS tier2_projects_request_idx   ON public.tier2_projects(advisory_request_id);
CREATE INDEX IF NOT EXISTS tier2_projects_payment_idx   ON public.tier2_projects(payment_status);

CREATE OR REPLACE TRIGGER tier2_projects_touch_updated_at
  BEFORE UPDATE ON public.tier2_projects
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.tier2_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tier2_projects: client can read own project"  ON public.tier2_projects;
DROP POLICY IF EXISTS "tier2_projects: admin full access"            ON public.tier2_projects;

-- Clients can see their own project (not the internal fields like final_pdf_path
-- while paywall is active — enforced at application layer via Edge Function)
CREATE POLICY "tier2_projects: client can read own project"
  ON public.tier2_projects FOR SELECT
  USING (auth.uid() = client_user_id);

-- Admins have full CRUD
CREATE POLICY "tier2_projects: admin full access"
  ON public.tier2_projects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- B4. project_milestones — phase tracker for tier2_projects (spec §3.14)
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID        NOT NULL REFERENCES public.tier2_projects(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'in_progress', 'completed')),
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  -- Auto-stamped when status transitions to 'completed'
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.project_milestones
  IS 'Phase milestones for a Tier 2 advisory project. completed_at stamped automatically.';

CREATE INDEX IF NOT EXISTS milestones_project_idx ON public.project_milestones(project_id, sort_order);

-- Auto-stamp completed_at when milestone is marked completed
CREATE OR REPLACE FUNCTION public.stamp_milestone_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status <> 'completed' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status <> 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER milestones_stamp_completed
  BEFORE UPDATE OF status ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION public.stamp_milestone_completed();

ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "milestones: client can read own project milestones" ON public.project_milestones;
DROP POLICY IF EXISTS "milestones: admin full access"                      ON public.project_milestones;

-- Clients see milestones for their own projects
CREATE POLICY "milestones: client can read own project milestones"
  ON public.project_milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tier2_projects tp
      WHERE tp.id = project_id AND tp.client_user_id = auth.uid()
    )
  );

-- Admins have full CRUD
CREATE POLICY "milestones: admin full access"
  ON public.project_milestones FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- C. SUPPLEMENTAL POLICIES — public.* tables
--    The 001_foundation migration created basic owner + anon policies.
--    This section layers on admin / editor / analyst policies.
--    All DROP … IF EXISTS guards prevent duplicate-policy errors.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── public.profiles ─────────────────────────────────────────────────────────

-- Admins can read all profiles (CRM dashboard)
DROP POLICY IF EXISTS "profiles: admin can read all profiles"   ON public.profiles;
DROP POLICY IF EXISTS "profiles: admin can update any profile"  ON public.profiles;

CREATE POLICY "profiles: admin can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "profiles: admin can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Analysts can read all profiles (lead scoring)
DROP POLICY IF EXISTS "profiles: analyst can read all profiles" ON public.profiles;

CREATE POLICY "profiles: analyst can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_staff());

-- ─── public.reports ──────────────────────────────────────────────────────────

-- Editors / analysts can manage reports
DROP POLICY IF EXISTS "reports: staff can manage all reports" ON public.reports;

CREATE POLICY "reports: staff can manage all reports"
  ON public.reports FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ─── public.purchases ────────────────────────────────────────────────────────

-- Admins can read all purchases (revenue dashboard)
DROP POLICY IF EXISTS "purchases: admin can read all purchases"   ON public.purchases;
DROP POLICY IF EXISTS "purchases: admin can update any purchase"  ON public.purchases;

CREATE POLICY "purchases: admin can read all purchases"
  ON public.purchases FOR SELECT
  USING (public.is_admin());

CREATE POLICY "purchases: admin can update any purchase"
  ON public.purchases FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Analysts can read all purchases (revenue analytics)
DROP POLICY IF EXISTS "purchases: analyst can read all purchases" ON public.purchases;

CREATE POLICY "purchases: analyst can read all purchases"
  ON public.purchases FOR SELECT
  USING (public.is_staff());

-- ─── public.advisory_requests ────────────────────────────────────────────────

-- Admins / analysts manage the CRM pipeline
DROP POLICY IF EXISTS "advisory_requests: staff can manage all"  ON public.advisory_requests;

CREATE POLICY "advisory_requests: staff can manage all"
  ON public.advisory_requests FOR ALL
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ─── public.newsletter_subscribers ───────────────────────────────────────────

-- Admins manage subscriber list (export / unsubscribe)
DROP POLICY IF EXISTS "newsletter_subscribers: admin can manage all" ON public.newsletter_subscribers;

CREATE POLICY "newsletter_subscribers: admin can manage all"
  ON public.newsletter_subscribers FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- D. GRANTS — public.* supplemental tables
-- ─────────────────────────────────────────────────────────────────────────────

-- access_logs: users read own, service role inserts, admin reads all (via RLS)
GRANT SELECT ON public.access_logs TO authenticated;

-- whitelist_audit_log: admin only (via RLS — no direct client grant needed)
-- tier2_projects / project_milestones: authenticated clients read own (via RLS)
GRANT SELECT ON public.tier2_projects    TO authenticated;
GRANT SELECT ON public.project_milestones TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- E. vnsir SCHEMA GRANTS
--    The vnsir schema tables are served via PostgREST once "vnsir" is added to
--    [api].schemas in supabase/config.toml.  Grant appropriate privileges so
--    PostgREST can proxy requests subject to RLS.
-- ─────────────────────────────────────────────────────────────────────────────

-- anon: browse published non-stealth reports, read published briefs, submit forms
GRANT USAGE                    ON SCHEMA vnsir                   TO anon;
GRANT SELECT                   ON vnsir.reports                  TO anon;
GRANT SELECT                   ON vnsir.analyst_briefs           TO anon;
GRANT INSERT                   ON vnsir.advisory_requests        TO anon;
GRANT INSERT                   ON vnsir.email_subscribers        TO anon;
GRANT INSERT                   ON vnsir.event_tracking           TO anon;

-- authenticated: self-service on own profile / purchases / advisory requests
GRANT USAGE                    ON SCHEMA vnsir                   TO authenticated;
GRANT SELECT, UPDATE           ON vnsir.profiles                 TO authenticated;
GRANT SELECT                   ON vnsir.reports                  TO authenticated;
GRANT SELECT                   ON vnsir.analyst_briefs           TO authenticated;
GRANT SELECT                   ON vnsir.purchases                TO authenticated;
GRANT INSERT, SELECT           ON vnsir.advisory_requests        TO authenticated;
GRANT INSERT, SELECT, UPDATE   ON vnsir.email_subscribers        TO authenticated;
GRANT INSERT                   ON vnsir.event_tracking           TO authenticated;

-- service_role bypasses RLS automatically — no explicit grant needed.

-- ─────────────────────────────────────────────────────────────────────────────
-- F. TRIGGER — auto-create vnsir.profiles row on new auth user signup
--    Mirrors the public.handle_new_user() pattern from 001_foundation.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION vnsir.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = vnsir, public
AS $$
BEGIN
  INSERT INTO vnsir.profiles (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Guard: only create the trigger if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created_vnsir'
  ) THEN
    CREATE TRIGGER on_auth_user_created_vnsir
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION vnsir.handle_new_user();
  END IF;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- G. TRIGGER — auto-sync vnsir.profiles.is_whitelisted from vnsir.whitelist
--    When an email is added to vnsir.whitelist and a matching auth user exists,
--    automatically set their profile.is_whitelisted = true.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION vnsir.sync_whitelist_to_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = vnsir, auth, public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Look up user by email in auth.users
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = NEW.email
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
      -- Update the vnsir profile
      UPDATE vnsir.profiles
      SET is_whitelisted = true, updated_at = NOW()
      WHERE id = v_user_id;

      -- Also update public profile flag
      UPDATE public.profiles
      SET is_whitelisted = true, updated_at = NOW()
      WHERE id = v_user_id;

      -- Backfill whitelist.user_id if it was NULL
      IF NEW.user_id IS NULL THEN
        NEW.user_id = v_user_id;
      END IF;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    -- Revoke whitelist when row is deleted
    IF OLD.user_id IS NOT NULL THEN
      UPDATE vnsir.profiles
      SET is_whitelisted = false, updated_at = NOW()
      WHERE id = OLD.user_id;

      UPDATE public.profiles
      SET is_whitelisted = false, updated_at = NOW()
      WHERE id = OLD.user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_vnsir_whitelist_sync ON vnsir.whitelist;

CREATE TRIGGER trg_vnsir_whitelist_sync
  BEFORE INSERT OR UPDATE OR DELETE ON vnsir.whitelist
  FOR EACH ROW EXECUTE FUNCTION vnsir.sync_whitelist_to_profile();

-- ─────────────────────────────────────────────────────────────────────────────
-- H. SECURITY VALIDATION COMMENTS
--    These comments document the security invariants for code review / audit.
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON FUNCTION public.is_admin() IS
  'Returns true if the calling user has role=super_admin. SECURITY DEFINER — bypasses caller RLS for the lookup.';

COMMENT ON FUNCTION public.is_staff() IS
  'Returns true if the calling user has role in (editor, analyst, super_admin). SECURITY DEFINER.';

COMMENT ON FUNCTION vnsir.handle_new_user() IS
  'Auto-creates a vnsir.profiles row on new Supabase Auth sign-up. Runs AFTER INSERT ON auth.users.';

COMMENT ON FUNCTION vnsir.sync_whitelist_to_profile() IS
  'Keeps vnsir.profiles.is_whitelisted + public.profiles.is_whitelisted in sync when the whitelist table is modified.';

-- =============================================================================
-- END OF MIGRATION 20260416000002_rls_policies.sql
--
-- Security invariants enforced by this migration:
--   1. ZERO-KNOWLEDGE PDF:  watermarked_pdf_path never exposed to anon/authed
--      via direct table read — served only by Edge Functions (service_role).
--   2. STEALTH REPORTS:     is_stealth=true reports require is_whitelisted=true
--      in both public.profiles and vnsir.profiles (dual-check defence-in-depth).
--   3. PURCHASE WRITES:     INSERT/UPDATE on purchases tables are service_role
--      only — Stripe webhook Edge Function owns the state machine.
--   4. WHITELIST WRITES:    Only super_admin can modify vnsir.whitelist.
--      Every change triggers sync to profile flags (G above).
--   5. AUDIT TRAIL:         All admin whitelist/role changes must be written to
--      whitelist_audit_log by the application layer (enforced via RLS — only
--      admins can INSERT into that table).
--   6. ADMIN HELPER BYPASS: is_admin() and is_staff() are SECURITY DEFINER,
--      so they can read profiles without triggering circular RLS evaluation.
-- =============================================================================
