/*
# Create CKM TV homepage videos

1. New Tables
- `ckmtv_videos` stores YouTube videos managed by administrators and shown in the CKM TV section on the public homepage.
- `id` uniquely identifies each video.
- `title` is the public video title.
- `description` is optional supporting text.
- `youtube_url` stores the administrator-provided YouTube link.
- `sort_order` controls display order.
- `is_active` controls whether the video is visible publicly.
- `created_at` and `updated_at` record lifecycle timestamps.

2. Security
- Row level security is enabled.
- Anonymous and signed-in visitors can read active videos only.
- Only authenticated administrators can create, update, or delete videos.
- Administrative writes use the existing SECURITY DEFINER admin-check function through RLS policies.

3. Important Notes
- The application validates and embeds only YouTube hostnames; other URLs are not rendered as video frames.
- Existing data is not modified or removed.
*/

CREATE TABLE IF NOT EXISTS public.ckmtv_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text,
  youtube_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ckmtv_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_active_ckmtv_videos" ON public.ckmtv_videos;
CREATE POLICY "public_select_active_ckmtv_videos"
ON public.ckmtv_videos FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_ckmtv_videos" ON public.ckmtv_videos;
CREATE POLICY "admin_insert_ckmtv_videos"
ON public.ckmtv_videos FOR INSERT
TO authenticated
WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_ckmtv_videos" ON public.ckmtv_videos;
CREATE POLICY "admin_update_ckmtv_videos"
ON public.ckmtv_videos FOR UPDATE
TO authenticated
USING (is_current_user_admin())
WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_ckmtv_videos" ON public.ckmtv_videos;
CREATE POLICY "admin_delete_ckmtv_videos"
ON public.ckmtv_videos FOR DELETE
TO authenticated
USING (is_current_user_admin());

CREATE INDEX IF NOT EXISTS ckmtv_videos_active_order_idx
ON public.ckmtv_videos (is_active, sort_order);

CREATE OR REPLACE FUNCTION public.set_ckmtv_videos_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_ckmtv_videos_updated_at ON public.ckmtv_videos;
CREATE TRIGGER set_ckmtv_videos_updated_at
BEFORE UPDATE ON public.ckmtv_videos
FOR EACH ROW
EXECUTE FUNCTION public.set_ckmtv_videos_updated_at();

REVOKE EXECUTE ON FUNCTION public.set_ckmtv_videos_updated_at() FROM anon, authenticated;
