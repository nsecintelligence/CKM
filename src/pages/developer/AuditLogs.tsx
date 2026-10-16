import { useState, useMemo } from 'react';
import { useDeveloperData } from '../../hooks/useDeveloperData';
import { ScrollText, Search, Download } from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs, loading } = useDeveloperData();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = useMemo(() => {
    return auditLogs.filter(log => {
      if (filterAction !== 'all' && log.action !== filterAction) return false;
      if (search) {
        const q = search.toLowerCase();
        return (log.actor_email || '').toLowerCase().includes(q) ||
               (log.action || '').toLowerCase().includes(q) ||
               (log.entity_type || '').toLowerCase().includes(q) ||
               JSON.stringify(log.details || {}).toLowerCase().includes(q);
      }
      return true;
    });
  }, [auditLogs, filterAction, search]);

  const exportCSV = () => {
    const headers = ['Timestamp', 'Actor Email', 'Action', 'Entity Type', 'Entity ID', 'Details'];
    const rows = filtered.map(log => [
      log.created_at, log.actor_email || '', log.action, log.entity_type || '',
      log.entity_id || '', JSON.stringify(log.details || {}),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const actionStyles: Record<string, string> = {
    create: 'text-emerald-400 bg-emerald-500/10',
    update: 'text-sky-400 bg-sky-500/10',
    delete: 'text-red-400 bg-red-500/10',
    login: 'text-gray-400 bg-gray-500/10',
    logout: 'text-gray-400 bg-gray-500/10',
    export: 'text-amber-400 bg-amber-500/10',
    sync: 'text-purple-400 bg-purple-500/10',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ScrollText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Audit Logs</h2>
          </div>
          <p className="text-sm text-gray-500">Developer action history for accountability and compliance.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by actor, action, entity..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="all">All Actions</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="export">Export</option>
          <option value="sync">Sync</option>
        </select>
      </div>

      {/* Log Table */}
      {filtered.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <ScrollText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No audit logs found.</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                  <th className="text-left px-4 py-3 font-medium">Actor</th>
                  <th className="text-left px-4 py-3 font-medium">Action</th>
                  <th className="text-left px-4 py-3 font-medium">Entity</th>
                  <th className="text-left px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{log.actor_email || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${actionStyles[log.action] || 'text-gray-400 bg-gray-500/10'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {log.entity_type ? <span className="capitalize">{log.entity_type}</span> : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
