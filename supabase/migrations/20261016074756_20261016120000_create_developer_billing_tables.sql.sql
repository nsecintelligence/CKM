/*
# Developer Billing & Infrastructure Monitoring Tables

## Purpose
Creates the backend tables for a developer-only dashboard that tracks
infrastructure expenses, API usage, database/hosting costs, AI credits,
invoices, budgets, and audit logs for the CKM Hospital website.

## Access Control
- A new `is_current_user_developer()` SECURITY DEFINER function checks
  `user_roles` for `role = 'developer'`.
- All billing tables enforce RLS with policies restricted to
  `authenticated` users whose role is `developer`.
- `developer_service_accounts` stores only non-secret metadata (provider
  name, display label, status). Actual API keys/secrets are NEVER stored
  in these tables — they live in edge-function environment variables.
- An audit-log table records developer actions for accountability.

## New Tables
1. `developer_service_accounts` — registered API/AI/hosting/DB providers (metadata only, no secrets)
2. `infrastructure_usage` — usage metrics per provider (requests, tokens, storage, egress, etc.)
3. `infrastructure_invoices` — manually entered or imported invoices
4. `infrastructure_budgets` — monthly budget thresholds per category
5. `infrastructure_alerts` — budget/credit/renewal alert configuration and state
6. `infrastructure_audit_logs` — developer action audit trail

## Existing Table Modified
- `user_roles` — no schema change; the `role` text column already accepts
  arbitrary values. A `developer` role value is now used alongside the
  existing `admin`, `doctor`, `nurse`, `staff`, `patient` values.

## Security
- RLS enabled on every new table.
- SELECT/INSERT/UPDATE/DELETE policies all check `is_current_user_developer()`.
- The `is_current_user_developer()` function is SECURITY DEFINER with a
  fixed `search_path = public`, mirroring the existing
  `is_current_user_admin()` pattern.
- `developer_service_accounts` has a `has_sync_error` flag and
  `last_sync_at` timestamp so sync failures can be displayed honestly.
*/

-- ───────────────────────────────────────────────
-- 1. Developer role check function
-- ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_current_user_developer()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
SELECT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = auth.uid() AND role = 'developer'
);
$function$;

-- Grant execute to authenticated (same pattern as is_current_user_admin)
REVOKE ALL ON FUNCTION public.is_current_user_developer() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_current_user_developer() TO authenticated;

-- ───────────────────────────────────────────────
-- 2. developer_service_accounts
-- ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.developer_service_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  display_label text NOT NULL,
  category text NOT NULL DEFAULT 'api',
  -- category values: 'api', 'database', 'hosting', 'ai'
  status text NOT NULL DEFAULT 'active',
  -- status values: 'active', 'inactive', 'error'
  has_sync_error boolean NOT NULL DEFAULT false,
  sync_error_message text,
  last_sync_at timestamptz,
  -- provider-reported quota / credit balance (nullable — only if API supports it)
  available_quota text,
  rate_limit_info text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.developer_service_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_select_service_accounts" ON public.developer_service_accounts;
CREATE POLICY "dev_select_service_accounts"
  ON public.developer_service_accounts FOR SELECT
  TO authenticated USING (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_insert_service_accounts" ON public.developer_service_accounts;
CREATE POLICY "dev_insert_service_accounts"
  ON public.developer_service_accounts FOR INSERT
  TO authenticated WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_update_service_accounts" ON public.developer_service_accounts;
CREATE POLICY "dev_update_service_accounts"
  ON public.developer_service_accounts FOR UPDATE
  TO authenticated USING (public.is_current_user_developer())
  WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_delete_service_accounts" ON public.developer_service_accounts;
CREATE POLICY "dev_delete_service_accounts"
  ON public.developer_service_accounts FOR DELETE
  TO authenticated USING (public.is_current_user_developer());

-- ───────────────────────────────────────────────
-- 3. infrastructure_usage
-- ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.infrastructure_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_account_id uuid REFERENCES public.developer_service_accounts(id) ON DELETE CASCADE,
  provider_name text NOT NULL,
  metric_type text NOT NULL,
  -- metric_type: 'api_requests', 'input_tokens', 'output_tokens', 'storage_mb', 'compute_hours', 'egress_gb', 'estimated_cost_usd', 'actual_cost_usd'
  metric_value numeric NOT NULL DEFAULT 0,
  unit text,
  billing_period_start date NOT NULL,
  billing_period_end date NOT NULL,
  is_estimated boolean NOT NULL DEFAULT false,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_infra_usage_period
  ON public.infrastructure_usage (billing_period_start, billing_period_end);
CREATE INDEX IF NOT EXISTS idx_infra_usage_provider
  ON public.infrastructure_usage (provider_name);
CREATE INDEX IF NOT EXISTS idx_infra_usage_metric
  ON public.infrastructure_usage (metric_type);

ALTER TABLE public.infrastructure_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_select_usage" ON public.infrastructure_usage;
CREATE POLICY "dev_select_usage"
  ON public.infrastructure_usage FOR SELECT
  TO authenticated USING (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_insert_usage" ON public.infrastructure_usage;
CREATE POLICY "dev_insert_usage"
  ON public.infrastructure_usage FOR INSERT
  TO authenticated WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_update_usage" ON public.infrastructure_usage;
CREATE POLICY "dev_update_usage"
  ON public.infrastructure_usage FOR UPDATE
  TO authenticated USING (public.is_current_user_developer())
  WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_delete_usage" ON public.infrastructure_usage;
CREATE POLICY "dev_delete_usage"
  ON public.infrastructure_usage FOR DELETE
  TO authenticated USING (public.is_current_user_developer());

-- ───────────────────────────────────────────────
-- 4. infrastructure_invoices
-- ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.infrastructure_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  service_category text NOT NULL DEFAULT 'api',
  -- 'api', 'database', 'hosting', 'ai', 'domain', 'other'
  invoice_number text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  amount_usd numeric,
  -- converted amount in USD (manually entered or computed)
  billing_period_start date NOT NULL,
  billing_period_end date NOT NULL,
  due_date date,
  payment_status text NOT NULL DEFAULT 'unpaid',
  -- 'unpaid', 'paid', 'overdue', 'cancelled'
  paid_at timestamptz,
  invoice_document_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_provider
  ON public.infrastructure_invoices (provider_name);
CREATE INDEX IF NOT EXISTS idx_invoices_category
  ON public.infrastructure_invoices (service_category);
CREATE INDEX IF NOT EXISTS idx_invoices_status
  ON public.infrastructure_invoices (payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_period
  ON public.infrastructure_invoices (billing_period_start, billing_period_end);

ALTER TABLE public.infrastructure_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_select_invoices" ON public.infrastructure_invoices;
CREATE POLICY "dev_select_invoices"
  ON public.infrastructure_invoices FOR SELECT
  TO authenticated USING (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_insert_invoices" ON public.infrastructure_invoices;
CREATE POLICY "dev_insert_invoices"
  ON public.infrastructure_invoices FOR INSERT
  TO authenticated WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_update_invoices" ON public.infrastructure_invoices;
CREATE POLICY "dev_update_invoices"
  ON public.infrastructure_invoices FOR UPDATE
  TO authenticated USING (public.is_current_user_developer())
  WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_delete_invoices" ON public.infrastructure_invoices;
CREATE POLICY "dev_delete_invoices"
  ON public.infrastructure_invoices FOR DELETE
  TO authenticated USING (public.is_current_user_developer());

-- ───────────────────────────────────────────────
-- 5. infrastructure_budgets
-- ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.infrastructure_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  -- 'api', 'database', 'hosting', 'ai', 'domain', 'total'
  monthly_limit_usd numeric NOT NULL DEFAULT 0,
  alert_threshold_pct integer NOT NULL DEFAULT 80,
  -- alert when spend reaches this percentage of monthly_limit_usd
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.infrastructure_budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_select_budgets" ON public.infrastructure_budgets;
CREATE POLICY "dev_select_budgets"
  ON public.infrastructure_budgets FOR SELECT
  TO authenticated USING (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_insert_budgets" ON public.infrastructure_budgets;
CREATE POLICY "dev_insert_budgets"
  ON public.infrastructure_budgets FOR INSERT
  TO authenticated WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_update_budgets" ON public.infrastructure_budgets;
CREATE POLICY "dev_update_budgets"
  ON public.infrastructure_budgets FOR UPDATE
  TO authenticated USING (public.is_current_user_developer())
  WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_delete_budgets" ON public.infrastructure_budgets;
CREATE POLICY "dev_delete_budgets"
  ON public.infrastructure_budgets FOR DELETE
  TO authenticated USING (public.is_current_user_developer());

-- ───────────────────────────────────────────────
-- 6. infrastructure_alerts
-- ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.infrastructure_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL,
  -- 'budget_threshold', 'low_credits', 'overdue_invoice', 'renewal_upcoming', 'usage_spike', 'sync_failure'
  severity text NOT NULL DEFAULT 'warning',
  -- 'info', 'warning', 'critical'
  title text NOT NULL,
  message text NOT NULL,
  related_provider text,
  related_category text,
  is_resolved boolean NOT NULL DEFAULT false,
  resolved_at timestamptz,
  triggered_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_resolved
  ON public.infrastructure_alerts (is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_type
  ON public.infrastructure_alerts (alert_type);

ALTER TABLE public.infrastructure_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_select_alerts" ON public.infrastructure_alerts;
CREATE POLICY "dev_select_alerts"
  ON public.infrastructure_alerts FOR SELECT
  TO authenticated USING (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_insert_alerts" ON public.infrastructure_alerts;
CREATE POLICY "dev_insert_alerts"
  ON public.infrastructure_alerts FOR INSERT
  TO authenticated WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_update_alerts" ON public.infrastructure_alerts;
CREATE POLICY "dev_update_alerts"
  ON public.infrastructure_alerts FOR UPDATE
  TO authenticated USING (public.is_current_user_developer())
  WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_delete_alerts" ON public.infrastructure_alerts;
CREATE POLICY "dev_delete_alerts"
  ON public.infrastructure_alerts FOR DELETE
  TO authenticated USING (public.is_current_user_developer());

-- ───────────────────────────────────────────────
-- 7. infrastructure_audit_logs
-- ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.infrastructure_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  -- 'login', 'logout', 'create', 'update', 'delete', 'export', 'sync'
  entity_type text,
  -- 'service_account', 'invoice', 'budget', 'alert', 'usage'
  entity_id uuid,
  details jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created
  ON public.infrastructure_audit_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON public.infrastructure_audit_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action
  ON public.infrastructure_audit_logs (action);

ALTER TABLE public.infrastructure_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_select_audit_logs" ON public.infrastructure_audit_logs;
CREATE POLICY "dev_select_audit_logs"
  ON public.infrastructure_audit_logs FOR SELECT
  TO authenticated USING (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_insert_audit_logs" ON public.infrastructure_audit_logs;
CREATE POLICY "dev_insert_audit_logs"
  ON public.infrastructure_audit_logs FOR INSERT
  TO authenticated WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_update_audit_logs" ON public.infrastructure_audit_logs;
CREATE POLICY "dev_update_audit_logs"
  ON public.infrastructure_audit_logs FOR UPDATE
  TO authenticated USING (public.is_current_user_developer())
  WITH CHECK (public.is_current_user_developer());

DROP POLICY IF EXISTS "dev_delete_audit_logs" ON public.infrastructure_audit_logs;
CREATE POLICY "dev_delete_audit_logs"
  ON public.infrastructure_audit_logs FOR DELETE
  TO authenticated USING (public.is_current_user_developer());

-- ───────────────────────────────────────────────
-- 8. Grant SELECT on user_roles for developer check to work
-- (already granted to authenticated via existing policies)
-- ───────────────────────────────────────────────

-- The is_current_user_developer() function reads user_roles internally.
-- Since it is SECURITY DEFINER, it runs with the function owner's
-- privileges and bypasses RLS on user_roles — same as
-- is_current_user_admin(). No additional grants needed.
