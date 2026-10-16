import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import {
  LayoutDashboard,
  Code2,
  Database,
  Cloud,
  Sparkles,
  FileText,
  Bell,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  Terminal,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const devLinks = [
  { path: '/developer-admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/developer-admin/api-billing', label: 'API Billing', icon: Code2 },
  { path: '/developer-admin/database', label: 'Database & Supabase', icon: Database },
  { path: '/developer-admin/hosting', label: 'Hosting & Domains', icon: Cloud },
  { path: '/developer-admin/ai-credits', label: 'AI Credits', icon: Sparkles },
  { path: '/developer-admin/invoices', label: 'Invoices', icon: FileText },
  { path: '/developer-admin/budgets', label: 'Budgets & Alerts', icon: Bell },
  { path: '/developer-admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
  { path: '/developer-admin/settings', label: 'Settings', icon: Settings },
];

export function logDevAction(
  action: string,
  entityType?: string,
  details?: Record<string, unknown>
) {
  supabase.auth.getUser().then(({ data }) => {
    supabase.from('infrastructure_audit_logs').insert({
      actor_id: data.user?.id || null,
      actor_email: data.user?.email || null,
      action,
      entity_type: entityType || null,
      details: details || null,
      user_agent: navigator.userAgent,
    }).then(({ error }) => {
      if (error) console.error('Audit log insert failed:', error);
    });
  });
}

export function useLogDevAction() {
  return useCallback(logDevAction, []);
}

export default function DeveloperLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    logDevAction('login', undefined, { path: location.pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignOut = useCallback(async () => {
    logDevAction('logout');
    await signOut();
  }, [signOut]);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } border-r border-gray-800`}
      >
        <div className="p-5 border-b border-gray-800">
          <Link to="/developer-admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm block">Developer Console</span>
              <span className="text-xs text-gray-500">CKM Infrastructure</span>
            </div>
          </Link>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {devLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-3 truncate">{user?.email}</div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gray-900 shadow-sm h-14 flex items-center justify-between px-4 lg:px-6 border-b border-gray-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-400"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {devLinks.find((l) => l.path === location.pathname)?.label || 'Overview'}
          </h1>
          <Link
            to="/admin"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Hospital Admin →
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

