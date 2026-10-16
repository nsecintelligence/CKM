import { useDeveloperData } from '../../hooks/useDeveloperData';
import { useAuth } from '../../hooks/useAuth';
import { Settings, Shield, Key, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const { serviceAccounts, loading } = useDeveloperData();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeAccounts = serviceAccounts.filter(a => a.status === 'active').length;
  const errorAccounts = serviceAccounts.filter(a => a.status === 'error').length;
  const syncErrors = serviceAccounts.filter(a => a.has_sync_error).length;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Settings</h2>
        </div>
        <p className="text-sm text-gray-500">Developer console configuration and account information.</p>
      </div>

      {/* Account Info */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-emerald-400" /> Developer Account
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-sm text-gray-400">Signed in as</span>
            <span className="text-sm text-white font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-800">
            <span className="text-sm text-gray-400">Role</span>
            <span className="text-sm text-emerald-400 font-medium">Developer</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-400">Access Level</span>
            <span className="text-sm text-white">Infrastructure & Billing</span>
          </div>
        </div>
      </div>

      {/* Service Summary */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Service Accounts Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{serviceAccounts.length}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{activeAccounts}</div>
            <div className="text-xs text-gray-500 mt-1">Active</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{errorAccounts}</div>
            <div className="text-xs text-gray-500 mt-1">Errors</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{syncErrors}</div>
            <div className="text-xs text-gray-500 mt-1">Sync Issues</div>
          </div>
        </div>
      </div>

      {/* Security Notes */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-emerald-400" /> Security & API Keys
        </h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p>API provider keys and secrets are stored as edge-function environment variables, never in the database or frontend code.</p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p>All billing tables enforce Row Level Security (RLS) — only accounts with the <code className="text-emerald-400 bg-gray-800 px-1.5 py-0.5 rounded text-xs">developer</code> role can read or write.</p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p>All developer actions (create, update, delete, export, sync) are recorded in the audit log.</p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <p>To grant developer access to a new user, add a row to <code className="text-emerald-400 bg-gray-800 px-1.5 py-0.5 rounded text-xs">user_roles</code> with <code className="text-emerald-400 bg-gray-800 px-1.5 py-0.5 rounded text-xs">role = 'developer'</code> for that user's ID.</p>
          </div>
        </div>
      </div>

      {/* Useful Links */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
            <span className="text-sm text-gray-300">Supabase Dashboard</span>
            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </a>
          <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
            <span className="text-sm text-gray-300">Vercel Dashboard</span>
            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </a>
          <a href="https://platform.openai.com/usage" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
            <span className="text-sm text-gray-300">OpenAI Usage</span>
            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </a>
          <Link to="/admin" className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
            <span className="text-sm text-gray-300">Hospital Admin Panel</span>
            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
