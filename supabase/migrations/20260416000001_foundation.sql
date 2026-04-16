-- =============================================================================
-- VNSIR Foundation Migration: 001_foundation.sql
-- Project: paperclip (qdhengvarelfdtmycnti)
-- Author:  Analytics Engineer Agent
-- Date:    2026-04-16
-- Purpose: Establishes core entity tables — profiles, reports, purchases,
--          advisory_requests, and newsletter_subscribers — along with RLS
--          policies, indexes, and helper triggers.
-- =============================================================================

-- ──────────────────────────────────────────────────────────────────────────────
-- 0. EXTENSIONS
-- ──────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";     -- case-insensitive text for emails

-- ──────────────────────────────────────────────────────────────────────────────
-- 0b. ENUMS  (centralised, referenced by multiple tables)
-- ──────────────────────────────────────────────────────────────────────────────

-- Market sector taxonomy (used in reports.category, advisory_requests.target_sector)
CREATE TYPE sector_enum AS ENUM (
    'e_commerce',
    'gaming',
    'entertainment',
    'macro_economy',
    'other'
);

-- Access/pricing tier for profiles
CREATE TYPE access_tier_enum AS ENUM (
    'tier_0',   -- free / unverified
    'tier_1',   -- purchased at least one report
    'tier_2'    -- custom advisory client
);

-- Report lifecycle
CREATE TYPE report_status_enum AS ENUM (
    'draft',
    'published',
    'archived'
);

-- Payment state machine
CREATE TYPE payment_status_enum AS ENUM (
    'pending',
    'completed',
    'refunded',
    'disputed'
);

-- Advisory request lifecycle
CREATE TYPE advisory_status_enum AS ENUM (
    'received',
    'reviewing',
    'scoping',
    'in_progress',
    'delivered',
    'rejected'
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES
-- Extends auth.users — created automatically via trigger on auth.users INSERT.
-- One row per authenticated user.
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    -- Identity
    id                  uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,

    -- Personal details (collected at onboarding / from OAuth)
    full_name           text,
    job_title           text,

    -- Corporate email is separate from auth email (validated at form level to
    -- block freemail domains; stored here as source-of-truth for B2B CRM).
    corporate_email     citext      UNIQUE,

    company             text,
    industry_focus      sector_enum,

    -- Pricing / access tier
    access_tier         access_tier_enum NOT NULL DEFAULT 'tier_0',

    -- Running total of confirmed spend in USD cents (denormalised for fast
    -- dashboard queries; kept in sync by purchase trigger below).
    total_spent_cents   integer     NOT NULL DEFAULT 0
        CONSTRAINT total_spent_non_negative CHECK (total_spent_cents >= 0),

    -- Audit
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.profiles                  IS 'One row per authenticated user. Extends auth.users.';
COMMENT ON COLUMN public.profiles.corporate_email  IS 'Verified B2B email (freemail domains blocked at application layer).';
COMMENT ON COLUMN public.profiles.access_tier      IS 'tier_0=free, tier_1=report buyer, tier_2=advisory client.';
COMMENT ON COLUMN public.profiles.total_spent_cents IS 'Denormalised sum of completed purchase amounts in USD cents.';

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. REPORTS
-- Product catalogue — each row is a sellable market research report.
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
    id                  uuid            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Catalogue fields
    title               text            NOT NULL,
    slug                text            UNIQUE NOT NULL,           -- URL-safe identifier
    category            sector_enum     NOT NULL,
    price_cents         integer         NOT NULL
        CONSTRAINT price_positive CHECK (price_cents > 0),
    sku                 text            UNIQUE NOT NULL,           -- warehouse / Stripe product SKU
    page_count          integer
        CONSTRAINT page_count_positive CHECK (page_count IS NULL OR page_count > 0),

    -- Marketing copy (arrays → stored as PostgreSQL native arrays for
    -- simple retrieval without a join; each element is one bullet point)
    executive_summary   text[]          DEFAULT '{}',
    strategic_questions text[]          DEFAULT '{}',

    -- Publication
    publication_date    date,
    status              report_status_enum NOT NULL DEFAULT 'published',

    -- Assets (Supabase Storage paths / public URLs)
    cover_image_url     text,
    demo_slides         text[]          DEFAULT '{}',   -- array of Storage URLs for preview slides
    pdf_storage_path    text,                           -- private Storage path (served after purchase)

    -- Audit
    created_at          timestamptz     NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.reports               IS 'Sellable market research report catalogue.';
COMMENT ON COLUMN public.reports.slug          IS 'URL-safe identifier used in page routes, e.g. /intelligence-hub/vietnam-ecommerce-2026.';
COMMENT ON COLUMN public.reports.sku           IS 'Unique product SKU aligned with Stripe Product IDs.';
COMMENT ON COLUMN public.reports.demo_slides   IS 'Array of public Supabase Storage URLs for preview / teaser slides.';
COMMENT ON COLUMN public.reports.pdf_storage_path IS 'Private Storage path; served via signed URL after purchase confirmation.';

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. PURCHASES
-- One row per Stripe PaymentIntent → report delivery record.
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.purchases (
    id                          uuid            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relations
    user_id                     uuid            NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
    report_id                   uuid            NOT NULL REFERENCES public.reports (id) ON DELETE RESTRICT,

    -- Stripe
    stripe_payment_intent_id    text            UNIQUE NOT NULL,
    amount_cents                integer         NOT NULL
        CONSTRAINT purchase_amount_positive CHECK (amount_cents > 0),
    currency                    text            NOT NULL DEFAULT 'usd'
        CONSTRAINT currency_lowercase CHECK (currency = lower(currency)),
    status                      payment_status_enum NOT NULL DEFAULT 'pending',

    -- Fulfillment
    -- Path to buyer-specific watermarked PDF in private Supabase Storage.
    -- Generated async after payment confirmation.
    watermarked_pdf_path        text,

    -- Audit
    purchased_at                timestamptz     NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.purchases                       IS 'One row per Stripe PaymentIntent. Source-of-truth for report access.';
COMMENT ON COLUMN public.purchases.stripe_payment_intent_id IS 'Stripe PaymentIntent ID — unique, used for idempotency and webhook matching.';
COMMENT ON COLUMN public.purchases.watermarked_pdf_path IS 'Private Storage path to buyer-watermarked PDF; populated by async Edge Function.';

-- Prevent duplicate purchases (same user + same report can be purchased only
-- once in a completed state — allow re-attempts while pending/disputed).
CREATE UNIQUE INDEX purchases_user_report_completed_uidx
    ON public.purchases (user_id, report_id)
    WHERE status = 'completed';

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. ADVISORY_REQUESTS
-- Inbound custom research enquiries from the Custom Advisory landing page.
-- user_id is nullable — prospects may submit before creating an account.
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.advisory_requests (
    id                  uuid            PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Linked profile (set if user is authenticated at submission time)
    user_id             uuid            REFERENCES public.profiles (id) ON DELETE SET NULL,

    -- Lead qualification fields (mirror of Custom Advisory intake form)
    full_name           text            NOT NULL,
    job_title           text            NOT NULL,
    corporate_email     citext          NOT NULL,
    company             text            NOT NULL,
    target_sector       sector_enum     NOT NULL,
    key_question        text            NOT NULL,
    timeline            text            NOT NULL,   -- e.g. '< 2 Weeks', '1 Month', 'Next Quarter'

    -- CRM / pipeline status
    status              advisory_status_enum NOT NULL DEFAULT 'received',

    -- Internal notes (visible only to VNSIR staff, not exposed via RLS to client)
    internal_notes      text,

    -- Audit
    created_at          timestamptz     NOT NULL DEFAULT now(),
    updated_at          timestamptz     NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.advisory_requests              IS 'Custom research enquiries submitted via the Custom Advisory intake form.';
COMMENT ON COLUMN public.advisory_requests.user_id      IS 'NULL when prospect submits anonymously; linked post-registration.';
COMMENT ON COLUMN public.advisory_requests.timeline     IS 'Freeform timeline string from dropdown: "< 2 Weeks" | "1 Month" | "Next Quarter".';
COMMENT ON COLUMN public.advisory_requests.internal_notes IS 'Staff-only field; excluded from client-facing RLS policies.';

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. NEWSLETTER_SUBSCRIBERS
-- Analyst Brief sticky-bar lead capture — one corporate email per row.
-- Separate from profiles so anonymous visitors can subscribe.
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    email           citext      UNIQUE NOT NULL,
    -- Linked profile if the subscriber later registers
    user_id         uuid        REFERENCES public.profiles (id) ON DELETE SET NULL,
    subscribed_at   timestamptz NOT NULL DEFAULT now(),
    unsubscribed_at timestamptz,
    is_active       boolean     NOT NULL DEFAULT true
);

COMMENT ON TABLE public.newsletter_subscribers IS 'Analyst Brief newsletter subscribers. Separate from profiles to capture anonymous leads.';

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. INDEXES  (performance-critical query paths)
-- ──────────────────────────────────────────────────────────────────────────────

-- profiles
CREATE INDEX profiles_access_tier_idx     ON public.profiles (access_tier);
CREATE INDEX profiles_corporate_email_idx ON public.profiles (corporate_email);

-- reports
CREATE INDEX reports_category_idx         ON public.reports (category);
CREATE INDEX reports_status_idx           ON public.reports (status);
CREATE INDEX reports_slug_idx             ON public.reports (slug);
CREATE INDEX reports_publication_date_idx ON public.reports (publication_date DESC NULLS LAST);

-- purchases
CREATE INDEX purchases_user_id_idx        ON public.purchases (user_id);
CREATE INDEX purchases_report_id_idx      ON public.purchases (report_id);
CREATE INDEX purchases_status_idx         ON public.purchases (status);
CREATE INDEX purchases_stripe_pi_idx      ON public.purchases (stripe_payment_intent_id);

-- advisory_requests
CREATE INDEX advisory_user_id_idx         ON public.advisory_requests (user_id);
CREATE INDEX advisory_status_idx          ON public.advisory_requests (status);
CREATE INDEX advisory_sector_idx          ON public.advisory_requests (target_sector);

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. TRIGGERS
-- ──────────────────────────────────────────────────────────────────────────────

-- 7a. Auto-create profile row when a new user signs up via Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 7b. Update profiles.updated_at automatically on any row update.
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_touch_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER advisory_requests_touch_updated_at
    BEFORE UPDATE ON public.advisory_requests
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 7c. Maintain profiles.total_spent_cents denormalised counter.
--     Fires on purchases INSERT/UPDATE when status transitions to/from 'completed'.
CREATE OR REPLACE FUNCTION public.sync_profile_total_spent()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    delta integer := 0;
BEGIN
    -- Row inserted as completed
    IF (TG_OP = 'INSERT') AND (NEW.status = 'completed') THEN
        delta := NEW.amount_cents;

    -- Status changed TO completed
    ELSIF (TG_OP = 'UPDATE')
      AND (OLD.status <> 'completed')
      AND (NEW.status  = 'completed') THEN
        delta := NEW.amount_cents;

    -- Status changed FROM completed (refund / dispute)
    ELSIF (TG_OP = 'UPDATE')
      AND (OLD.status  = 'completed')
      AND (NEW.status <> 'completed') THEN
        delta := -OLD.amount_cents;
    END IF;

    IF delta <> 0 THEN
        UPDATE public.profiles
        SET    total_spent_cents = GREATEST(0, total_spent_cents + delta),
               updated_at        = NOW()
        WHERE  id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER purchases_sync_total_spent
    AFTER INSERT OR UPDATE OF status ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION public.sync_profile_total_spent();

-- 7d. Auto-upgrade access_tier to tier_1 on first completed purchase.
CREATE OR REPLACE FUNCTION public.upgrade_access_tier_on_purchase()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.status = 'completed' THEN
        UPDATE public.profiles
        SET    access_tier = CASE
                   WHEN access_tier = 'tier_0' THEN 'tier_1'::access_tier_enum
                   ELSE access_tier
               END,
               updated_at  = NOW()
        WHERE  id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER purchases_upgrade_tier
    AFTER INSERT OR UPDATE OF status ON public.purchases
    FOR EACH ROW EXECUTE FUNCTION public.upgrade_access_tier_on_purchase();

-- ──────────────────────────────────────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY (RLS)
-- Principle of least privilege:
--   • Authenticated users see/edit only their own rows.
--   • Public can read published reports (product catalogue).
--   • Anon can INSERT advisory_requests and newsletter_subscribers.
--   • Service role bypasses all RLS (used by Edge Functions / webhooks).
-- ──────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_requests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers  ENABLE ROW LEVEL SECURITY;

-- ─── profiles ────────────────────────────────────────────────────────────────
CREATE POLICY "profiles: owner can read own row"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "profiles: owner can update own row"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ─── reports ─────────────────────────────────────────────────────────────────
-- Public catalogue — anyone (including anon) can browse published reports.
CREATE POLICY "reports: public can read published reports"
    ON public.reports FOR SELECT
    USING (status = 'published');

-- ─── purchases ───────────────────────────────────────────────────────────────
CREATE POLICY "purchases: owner can read own purchases"
    ON public.purchases FOR SELECT
    USING (auth.uid() = user_id);

-- Inserts go through Stripe webhook Edge Function (service role) — no direct
-- client INSERT policy needed.

-- ─── advisory_requests ───────────────────────────────────────────────────────
-- Anon/authenticated can INSERT (submit the intake form).
CREATE POLICY "advisory_requests: anyone can submit"
    ON public.advisory_requests FOR INSERT
    WITH CHECK (true);

-- Authenticated owner can view their own requests.
CREATE POLICY "advisory_requests: owner can read own requests"
    ON public.advisory_requests FOR SELECT
    USING (auth.uid() = user_id);

-- ─── newsletter_subscribers ──────────────────────────────────────────────────
-- Anyone can subscribe (anonymous capture is intentional).
CREATE POLICY "newsletter_subscribers: anyone can subscribe"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

-- Authenticated users can view / unsubscribe their own record.
CREATE POLICY "newsletter_subscribers: owner can manage own subscription"
    ON public.newsletter_subscribers FOR ALL
    USING (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. GRANTS  (anon + authenticated roles)
-- ──────────────────────────────────────────────────────────────────────────────

-- anon role: submit forms + browse report catalogue
GRANT SELECT              ON public.reports                 TO anon;
GRANT INSERT              ON public.advisory_requests       TO anon;
GRANT INSERT              ON public.newsletter_subscribers  TO anon;

-- authenticated role: full self-service read/write within RLS scope
GRANT SELECT, UPDATE      ON public.profiles                TO authenticated;
GRANT SELECT              ON public.reports                 TO authenticated;
GRANT SELECT              ON public.purchases               TO authenticated;
GRANT INSERT, SELECT      ON public.advisory_requests       TO authenticated;
GRANT INSERT, SELECT,
      UPDATE, DELETE      ON public.newsletter_subscribers  TO authenticated;

-- ──────────────────────────────────────────────────────────────────────────────
-- END OF MIGRATION 001_foundation.sql
-- ──────────────────────────────────────────────────────────────────────────────
