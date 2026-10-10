-- Restore EXECUTE on is_current_user_admin() for authenticated role
-- This function is SECURITY DEFINER and only returns a boolean check against user_roles.
-- RLS policies on admin tables depend on it to verify admin status.
-- anon remains blocked (no execute) to prevent unauthenticated probing.
GRANT EXECUTE ON FUNCTION is_current_user_admin() TO authenticated;