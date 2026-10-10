-- 1. Drop weak duplicate policies that allow any authenticated user to write
-- These are older policies that were superseded by admin-checked versions
-- but were never removed, leaving a privilege escalation path.

-- downloadable_forms: drop weak policies
DROP POLICY IF EXISTS "admin_delete_forms" ON downloadable_forms;
DROP POLICY IF EXISTS "admin_insert_forms" ON downloadable_forms;
DROP POLICY IF EXISTS "admin_update_forms" ON downloadable_forms;

-- service_prices: drop weak policies
DROP POLICY IF EXISTS "admin_delete_prices" ON service_prices;
DROP POLICY IF EXISTS "admin_insert_prices" ON service_prices;
DROP POLICY IF EXISTS "admin_update_prices" ON service_prices;

-- top_bar: drop weak policies
DROP POLICY IF EXISTS "delete_top_bar" ON top_bar;
DROP POLICY IF EXISTS "insert_top_bar" ON top_bar;
DROP POLICY IF EXISTS "update_top_bar" ON top_bar;

-- 2. Revoke EXECUTE on is_current_user_admin() from PUBLIC, anon, authenticated
-- This SECURITY DEFINER function should only be called internally by RLS policies,
-- not exposed as a public RPC endpoint via /rest/v1/rpc/is_current_user_admin
REVOKE EXECUTE ON FUNCTION is_current_user_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION is_current_user_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION is_current_user_admin() FROM authenticated;
