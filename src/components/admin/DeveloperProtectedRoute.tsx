import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { logUnauthorizedAccess } from '../../lib/securityLogger';

export default function DeveloperProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkDeveloper = async () => {
      if (!user) {
        setRoleLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'developer')
          .maybeSingle();

        if (error) {
          console.error('Error checking developer role:', error);
        }
        setIsDeveloper(!!data);
      } catch (err) {
        console.error('Developer role check failed:', err);
      } finally {
        setRoleLoading(false);
      }
    };
    checkDeveloper();
  }, [user]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Verifying developer access...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/developer-admin/login" replace state={{ from: location }} />;
  }

  if (!isDeveloper) {
    logUnauthorizedAccess(location.pathname);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md text-center border border-gray-700">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">
            This area is restricted to authorized developers only.
          </p>
          <a href="/" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Return to homepage
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
