/*
# Allow administrators to manage all CKM TV videos

1. Security Change
- Adds a separate authenticated administrator SELECT policy on `ckmtv_videos`.
- Public visitors continue to see only active videos through the existing public policy.
- Administrators can now see inactive videos in the homepage editor so they can manage visibility.

2. Important Notes
- No data is deleted or changed.
- The policy uses the existing SECURITY DEFINER admin-check function.
*/

DROP POLICY IF EXISTS "admin_select_ckmtv_videos" ON public.ckmtv_videos;
CREATE POLICY "admin_select_ckmtv_videos"
ON public.ckmtv_videos FOR SELECT
TO authenticated
USING (is_current_user_admin());
