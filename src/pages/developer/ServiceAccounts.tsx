import { useState, useMemo } from 'react';
import { useDeveloperData, currentMonthRange, isSameMonth, formatCurrency } from '../../hooks/useDeveloperData';
import { useLogDevAction } from '../../components/admin/DeveloperLayout';
import { supabase } from '../../lib/supabase';
import type { DeveloperServiceAccount, InfrastructureUsage } from '../../types';
import {
  Plus, Trash2, Edit3, X, AlertCircle, CheckCircle2, TrendingUp, type LucideIcon,
} from 'lucide-react';

interface Props {
  category: 'api' | 'database' | 'hosting' | 'ai';
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function ServiceAccounts({ category, title, description, icon: Icon }: Props) {
  const { serviceAccounts, usage, invoices, loading, refetch } = useDeveloperData();
  const logAction = useLogDevAction();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    provider_name: '',
    display_label: '',
    status: 'active',
    available_quota: '',
    rate_limit_info: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [usageForm, setUsageForm] = useState(false);
  const [usageData, setUsageData] = useState({
    metric_type: 'estimated_cost_usd',
    metric_value: 0,
    unit: 'USD',
    billing_period_start: new Date().toISOString().split('T')[0],
    billing_period_end: new Date().toISOString().split('T')[0],
    is_estimated: true,
  });

  const thisMonth = useMemo(() => currentMonthRange(), []);
  const accounts = serviceAccounts.filter(a => a.category === category);

  const monthlySpend = (providerName: string) => {
    return invoices
      .filter(inv => inv.provider_name === providerName && isSameMonth(inv.billing_period_start, thisMonth.start))
      .reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);
  };

  const providerUsage = (providerName: string) => {
    return usage.filter(u => u.provider_name === providerName && isSameMonth(u.billing_period_start, thisMonth.start));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        provider_name: form.provider_name.trim(),
        display_label: form.display_label.trim() || form.provider_name.trim(),
        category,
        status: form.status,
        available_quota: form.available_quota || null,
        rate_limit_info: form.rate_limit_info || null,
        notes: form.notes || null,
      };
      if (editingId) {
        const { error } = await supabase.from('developer_service_accounts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId);
        if (error) throw error;
        logAction('update', 'service_account', { id: editingId, provider: payload.provider_name });
      } else {
        const { error } = await supabase.from('developer_service_accounts').insert(payload);
        if (error) throw error;
        logAction('create', 'service_account', { provider: payload.provider_name });
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ provider_name: '', display_label: '', status: 'active', available_quota: '', rate_limit_info: '', notes: '' });
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Remove ${name}? This also removes its usage records.`)) return;
    const { error } = await supabase.from('developer_service_accounts').delete().eq('id', id);
    if (error) { console.error(error); return; }
    logAction('delete', 'service_account', { id, name });
    refetch();
  };

  const handleEdit = (acct: DeveloperServiceAccount) => {
    setEditingId(acct.id);
    setForm({
      provider_name: acct.provider_name,
      display_label: acct.display_label,
      status: acct.status,
      available_quota: acct.available_quota || '',
      rate_limit_info: acct.rate_limit_info || '',
      notes: acct.notes || '',
    });
    setShowForm(true);
  };

  const handleUsageSubmit = async (e: React.FormEvent, providerName: string) => {
    e.preventDefault();
    try {
      const payload: Partial<InfrastructureUsage> = {
        provider_name: providerName,
        metric_type: usageData.metric_type,
        metric_value: Number(usageData.metric_value) || 0,
        unit: usageData.unit || null,
        billing_period_start: usageData.billing_period_start,
        billing_period_end: usageData.billing_period_end,
        is_estimated: usageData.is_estimated,
      };
      const { error } = await supabase.from('infrastructure_usage').insert(payload);
      if (error) throw error;
      logAction('create', 'usage', { provider: providerName, metric: payload.metric_type });
      setUsageForm(false);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm({ provider_name: '', display_label: '', status: 'active', available_quota: '', rate_limit_info: '', notes: '' }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Provider
        </button>
      </div>

      {formError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">{formError}</div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Provider' : 'Add Provider'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Provider Name</label>
                <input required value={form.provider_name} onChange={e => setForm({ ...form, provider_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. OpenAI, Supabase, Vercel" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Display Label</label>
                <input value={form.display_label} onChange={e => setForm({ ...form, display_label: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Friendly name (optional)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Available Quota</label>
                  <input value={form.available_quota} onChange={e => setForm({ ...form, available_quota: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. 50,000 req/mo" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rate Limit Info</label>
                <input value={form.rate_limit_info} onChange={e => setForm({ ...form, rate_limit_info: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="e.g. 500 req/min" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 bg-gray-800 text-gray-400 rounded-lg text-sm hover:text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provider Cards */}
      {accounts.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <Icon className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No {category} providers configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map(acct => {
            const spend = monthlySpend(acct.provider_name);
            const pUsage = providerUsage(acct.provider_name);
            return (
              <div key={acct.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold">{acct.display_label}</h3>
                      {acct.status === 'active' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {acct.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                      {acct.status === 'inactive' && <div className="w-2 h-2 rounded-full bg-gray-600" />}
                    </div>
                    <p className="text-xs text-gray-500">{acct.provider_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(acct)} className="text-gray-500 hover:text-emerald-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(acct.id, acct.provider_name)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {acct.has_sync_error && acct.sync_error_message && (
                  <div className="mb-3 bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-xs text-red-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{acct.sync_error_message}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">This Month</div>
                    <div className="text-lg font-bold text-emerald-400">{formatCurrency(spend)}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Available Quota</div>
                    <div className="text-sm font-medium text-white truncate">{acct.available_quota || 'N/A'}</div>
                  </div>
                </div>

                {pUsage.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {pUsage.slice(0, 4).map(u => (
                      <div key={u.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{u.metric_type.replace(/_/g, ' ')}</span>
                        <span className="text-white font-medium">
                          {u.metric_value.toLocaleString()}{u.unit ? ` ${u.unit}` : ''}
                          {u.is_estimated && <span className="text-amber-500 ml-1">(est.)</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {acct.rate_limit_info && (
                  <div className="text-xs text-gray-600 mb-2">Rate limit: {acct.rate_limit_info}</div>
                )}
                {acct.last_sync_at && (
                  <div className="text-xs text-gray-600 mb-2">Last sync: {new Date(acct.last_sync_at).toLocaleString()}</div>
                )}

                <button
                  onClick={() => { setUsageData({ ...usageData, billing_period_start: thisMonth.start, billing_period_end: thisMonth.end }); setUsageForm(!usageForm); }}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg text-xs transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Log Usage
                </button>

                {usageForm && (
                  <form onSubmit={e => handleUsageSubmit(e, acct.provider_name)} className="mt-3 pt-3 border-t border-gray-800 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <select value={usageData.metric_type} onChange={e => setUsageData({ ...usageData, metric_type: e.target.value })}
                        className="px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500">
                        <option value="estimated_cost_usd">Est. Cost (USD)</option>
                        <option value="actual_cost_usd">Actual Cost (USD)</option>
                        <option value="api_requests">API Requests</option>
                        <option value="input_tokens">Input Tokens</option>
                        <option value="output_tokens">Output Tokens</option>
                        <option value="storage_mb">Storage (MB)</option>
                        <option value="compute_hours">Compute Hours</option>
                        <option value="egress_gb">Egress (GB)</option>
                      </select>
                      <input type="number" step="0.01" required value={usageData.metric_value} onChange={e => setUsageData({ ...usageData, metric_value: Number(e.target.value) })}
                        className="px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Value" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" required value={usageData.billing_period_start} onChange={e => setUsageData({ ...usageData, billing_period_start: e.target.value })}
                        className="px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
                      <input type="date" required value={usageData.billing_period_end} onChange={e => setUsageData({ ...usageData, billing_period_end: e.target.value })}
                        className="px-2 py-1.5 rounded bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-400">
                      <input type="checkbox" checked={usageData.is_estimated} onChange={e => setUsageData({ ...usageData, is_estimated: e.target.checked })} className="w-3.5 h-3.5 rounded" />
                      Estimated (not provider-reported)
                    </label>
                    <button type="submit" className="w-full py-1.5 bg-emerald-600 text-white rounded text-xs font-medium">Save Usage</button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
