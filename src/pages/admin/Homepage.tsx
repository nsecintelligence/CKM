import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { HomepageContent, CKMTVVideo } from '../../types';
import { Save, Plus, Pencil, Trash2, X, Video } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';

export default function AdminHomepage() {
  const [data, setData] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [videos, setVideos] = useState<CKMTVVideo[]>([]);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [videoForm, setVideoForm] = useState({ title: '', description: '', youtube_url: '', sort_order: 0, is_active: true });
  const [form, setForm] = useState({
    site_name: '', site_logo_url: '',
    welcome_title: '', welcome_title_line2: '', welcome_text: '', hero_image_url: '', hero_cta_text: '', hero_cta_link: '',
    announcement_title: '', announcement_text: '', announcement_active: false,
    director_name: '', director_title: '', director_statement: '', director_photo_url: '',
  });

  useEffect(() => {
    supabase.from('homepage_content').select('*').maybeSingle().then(({ data }) => {
      if (data) {
        setData(data);
        setForm({
          site_name: data.site_name || 'City Hospital',
          site_logo_url: data.site_logo_url || '',
          welcome_title: data.welcome_title,
          welcome_title_line2: data.welcome_title_line2 || '',
          welcome_text: data.welcome_text,
          hero_image_url: data.hero_image_url || '',
          hero_cta_text: data.hero_cta_text,
          hero_cta_link: data.hero_cta_link,
          announcement_title: data.announcement_title || '',
          announcement_text: data.announcement_text || '',
          announcement_active: data.announcement_active,
          director_name: data.director_name || '',
          director_title: data.director_title || '',
          director_statement: data.director_statement || '',
          director_photo_url: data.director_photo_url || '',
        });
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    supabase.from('ckmtv_videos').select('*').order('sort_order').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error && data) setVideos(data);
    });
  }, []);

  const resetVideoForm = () => {
    setEditingVideoId(null);
    setVideoForm({ title: '', description: '', youtube_url: '', sort_order: videos.length, is_active: true });
  };

  const handleVideoSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoSaving(true);
    setVideoError('');
    const payload = {
      title: videoForm.title.trim(),
      description: videoForm.description.trim() || null,
      youtube_url: videoForm.youtube_url.trim(),
      sort_order: Number(videoForm.sort_order) || 0,
      is_active: videoForm.is_active,
    };
    const result = editingVideoId
      ? await supabase.from('ckmtv_videos').update(payload).eq('id', editingVideoId).select().maybeSingle()
      : await supabase.from('ckmtv_videos').insert(payload).select().maybeSingle();
    if (result.error || !result.data) {
      console.error('CKM TV video save error:', result.error);
      setVideoError('Could not save this video. Check the YouTube link and try again.');
    } else {
      setVideos((current) => editingVideoId ? current.map((video) => video.id === editingVideoId ? result.data as CKMTVVideo : video) : [...current, result.data as CKMTVVideo].sort((a, b) => a.sort_order - b.sort_order));
      resetVideoForm();
    }
    setVideoSaving(false);
  };

  const handleVideoDelete = async (id: string) => {
    if (!window.confirm('Remove this video from CKM TV?')) return;
    const { error } = await supabase.from('ckmtv_videos').delete().eq('id', id);
    if (error) {
      console.error('CKM TV video delete error:', error);
      setVideoError('Could not remove this video. Please try again.');
      return;
    }
    setVideos((current) => current.filter((video) => video.id !== id));
    if (editingVideoId === id) resetVideoForm();
  };

  const startVideoEdit = (video: CKMTVVideo) => {
    setEditingVideoId(video.id);
    setVideoForm({ title: video.title, description: video.description || '', youtube_url: video.youtube_url, sort_order: video.sort_order, is_active: video.is_active });
    setVideoError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      if (data) {
        const { error } = await supabase.from('homepage_content').update({
          site_name: form.site_name,
          site_logo_url: form.site_logo_url,
          welcome_title: form.welcome_title,
          welcome_title_line2: form.welcome_title_line2,
          welcome_text: form.welcome_text,
          hero_image_url: form.hero_image_url,
          hero_cta_text: form.hero_cta_text,
          hero_cta_link: form.hero_cta_link,
          announcement_title: form.announcement_title,
          announcement_text: form.announcement_text,
          announcement_active: form.announcement_active,
          director_name: form.director_name,
          director_title: form.director_title,
          director_statement: form.director_statement,
          director_photo_url: form.director_photo_url,
        }).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('homepage_content').insert({
          site_name: form.site_name,
          site_logo_url: form.site_logo_url,
          welcome_title: form.welcome_title,
          welcome_title_line2: form.welcome_title_line2,
          welcome_text: form.welcome_text,
          hero_image_url: form.hero_image_url,
          hero_cta_text: form.hero_cta_text,
          hero_cta_link: form.hero_cta_link,
          announcement_title: form.announcement_title,
          announcement_text: form.announcement_text,
          announcement_active: form.announcement_active,
          director_name: form.director_name,
          director_title: form.director_title,
          director_statement: form.director_statement,
          director_photo_url: form.director_photo_url,
        });
        if (error) throw error;
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      console.error('Homepage save error:', err);
      const message =
        err && typeof err === 'object' && 'message' in err && typeof (err as Record<string, unknown>).message === 'string'
          ? (err as Record<string, string>).message
          : err instanceof Error
            ? err.message
            : 'Failed to save changes. Check console for details.';
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Homepage Content</h2>
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div className="border-b pb-5">
          <h3 className="font-semibold text-gray-900 mb-4">Site Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
              <input value={form.site_name} onChange={(e) => setForm({ ...form, site_name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" />
            </div>
            <div>
              <ImageUpload
                value={form.site_logo_url}
                onChange={(url) => setForm({ ...form, site_logo_url: url })}
                label="Logo"
                folder="logos"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Title Line 1</label>
            <input value={form.welcome_title} onChange={(e) => setForm({ ...form, welcome_title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" placeholder="e.g. Charles Kulwa Memorial" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Title Line 2</label>
            <input value={form.welcome_title_line2} onChange={(e) => setForm({ ...form, welcome_title_line2: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" placeholder="e.g. Hospital" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Text</label>
          <textarea rows={3} value={form.welcome_text} onChange={(e) => setForm({ ...form, welcome_text: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" />
        </div>
        <ImageUpload
          value={form.hero_image_url}
          onChange={(url) => setForm({ ...form, hero_image_url: url })}
          label="Hero Image"
          folder="hero"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
            <input value={form.hero_cta_text} onChange={(e) => setForm({ ...form, hero_cta_text: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
            <input value={form.hero_cta_link} onChange={(e) => setForm({ ...form, hero_cta_link: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" />
          </div>
        </div>
        <div className="border-t pt-5">
          <h3 className="font-semibold text-gray-900 mb-4">Executive Director's Statement</h3>
          <p className="text-sm text-gray-500 mb-4">This appears on the homepage right before the services section. Upload a photo and write the director's welcome message.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Director Name</label>
              <input value={form.director_name} onChange={(e) => setForm({ ...form, director_name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" placeholder="e.g. Dr. John Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Director Title</label>
              <input value={form.director_title} onChange={(e) => setForm({ ...form, director_title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" placeholder="e.g. Executive Director" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Director's Statement</label>
            <textarea rows={4} value={form.director_statement} onChange={(e) => setForm({ ...form, director_statement: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" placeholder="Welcome message from the director..." />
          </div>
          <div className="mt-4">
            <ImageUpload
              value={form.director_photo_url}
              onChange={(url) => setForm({ ...form, director_photo_url: url })}
              label="Director Photo"
              folder="director"
            />
          </div>
        </div>
        <div className="border-t pt-5">
          <h3 className="font-semibold text-gray-900 mb-4">Announcement Banner</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Title</label>
              <input value={form.announcement_title} onChange={(e) => setForm({ ...form, announcement_title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input type="checkbox" id="announcement_active" checked={form.announcement_active} onChange={(e) => setForm({ ...form, announcement_active: e.target.checked })} className="w-4 h-4 text-green-700 rounded" />
              <label htmlFor="announcement_active" className="text-sm font-medium text-gray-700">Show Announcement</label>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Text</label>
            <textarea rows={2} value={form.announcement_text} onChange={(e) => setForm({ ...form, announcement_text: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-700 focus:border-transparent outline-none" />
          </div>
        </div>
        <div className="border-t pt-5">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Video className="w-5 h-5 text-red-600" /> CKM TV Videos</h3>
              <p className="text-sm text-gray-500 mt-1">Add YouTube links to show playable videos after Insurance Services on the homepage.</p>
            </div>
            {editingVideoId && <button type="button" onClick={resetVideoForm} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"><X className="w-4 h-4" /> Cancel edit</button>}
          </div>
          <form onSubmit={handleVideoSave} className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video title</label>
                <input required value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="e.g. Meet our maternity team" className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-700" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube link</label>
                <input required type="url" value={videoForm.youtube_url} onChange={(e) => setVideoForm({ ...videoForm, youtube_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-700" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea rows={2} value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-green-700" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={videoForm.is_active} onChange={(e) => setVideoForm({ ...videoForm, is_active: e.target.checked })} className="w-4 h-4 text-green-700 rounded" /> Show on homepage</label>
              <label className="flex items-center gap-2 text-sm text-gray-700">Display order <input type="number" min="0" value={videoForm.sort_order} onChange={(e) => setVideoForm({ ...videoForm, sort_order: Number(e.target.value) })} className="w-20 px-2 py-1.5 rounded-lg border border-gray-300" /></label>
              <button type="submit" disabled={videoSaving} className="btn-primary inline-flex items-center gap-2"><Plus className="w-4 h-4" /> {videoSaving ? 'Saving...' : editingVideoId ? 'Update Video' : 'Add Video'}</button>
            </div>
          </form>
          {videoError && <p className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{videoError}</p>}
          <div className="mt-4 space-y-2">
            {videos.length === 0 ? <p className="text-sm text-gray-500">No CKM TV videos added yet.</p> : videos.map((video) => (
              <div key={video.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 bg-white">
                <div className="min-w-0"><p className="font-medium text-gray-900 truncate">{video.title || 'Untitled video'}</p><p className="text-xs text-gray-500 truncate">{video.youtube_url} · {video.is_active ? 'Visible' : 'Hidden'}</p></div>
                <div className="flex items-center gap-2 shrink-0"><button type="button" onClick={() => startVideoEdit(video)} className="p-2 text-gray-600 hover:text-green-700" aria-label={`Edit ${video.title}`}><Pencil className="w-4 h-4" /></button><button type="button" onClick={() => handleVideoDelete(video.id)} className="p-2 text-gray-600 hover:text-red-700" aria-label={`Delete ${video.title}`}><Trash2 className="w-4 h-4" /></button></div>
              </div>
            ))}
          </div>
        </div>
        {saveError && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            Changes saved successfully!
          </div>
        )}
        <button type="submit" disabled={saving} className="btn-primary inline-flex items-center gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
