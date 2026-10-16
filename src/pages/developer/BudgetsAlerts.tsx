import { useState } from 'react';
import { useDeveloperData, currentMonthRange, isSameMonth, formatCurrency } from '../../hooks/useDeveloperData';
import { useLogDevAction } from '../../components/admin/DeveloperLayout';
import { supabase } from '../../lib/supabase';
import {
  Bell, Plus, Trash2, Edit3, X, AlertTriangle, CheckCircle2, TrendingUp, Shield,
} from 'lucide-react';

export default function BudgetsAlerts() {
  const { budgets, alerts, invoices, loading, refetch } = useDeveloperData();
  const logAction = useLogDevAction();
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [budgetForm, setBudgetForm] = useState({ category: 'api', monthly_limit_usd: 0, alert_threshold_pct: 80, is_active: true });
  const [saving, setSaving] = useState(false);

  const monthRange = currentMonthRange();

  const categorySpend = (category: string) => {
    if (category === 'total') {
      return invoices.filter(inv => isSameMonth(inv.billing_period_start, monthRange.start))
        .reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);
    }
    return invoices.filter(inv => inv.service_category === category && isSameMonth(inv.billing_period_start, monthRange.start))
      .reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);
  };

  const handleBudgetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        category: budgetForm.category,
        monthly_limit_usd: Number(budgetForm.monthly_limit_usd) || 0,
        alert_threshold_pct: Number(budgetForm.alert_threshold_pct) || 80,
        is_active: budgetForm.is_active,
      };
      if (editingBudgetId) {
        const { error } = await supabase.from('infrastructure_budgets').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingBudgetId);
        if (error) throw error;
        logAction('update', 'budget', { id: editingBudgetId, category: payload.category });
      } else {
        const { error } = await supabase.from('infrastructure_budgets').insert(payload);
        if (error) throw error;
        logAction('create', 'budget', { category: payload.category });
      }
      setShowBudgetForm(false);
      setEditingBudgetId(null);
      setBudgetForm({ category: 'api', monthly_limit_usd: 0, alert_threshold_pct: 80, is_active: true });
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBudgetDelete = async (id: string, category: string) => {
    if (!window.confirm(`Delete budget for ${category}?`)) return;
    const { error } = await supabase.from('infrastructure_budgets').delete().eq('id', id);
    if (error) { console.error(error); return; }
    logAction('delete', 'budget', { id, category });
    refetch();
  };

  const handleBudgetEdit = (id: string, category: string, limit: number, threshold: number, active: boolean) => {
    setEditingBudgetId(id);
    setBudgetForm({ category, monthly_limit_usd: limit, alert_threshold_pct: threshold, is_active: active });
    setShowBudgetForm(true);
  };

  const resolveAlert = async (id: string) => {
    const { error } = await supabase.from('infrastructure_alerts')
      .update({ is_resolved: true, resolved_at: new Date().toISOString() }).eq('id', id);
    if (error) { console.error(error); return; }
    logAction('update', 'alert', { id, action: 'resolve' });
    refetch();
  };

  const deleteAlert = async (id: string) => {
    const { error } = await supabase.from('infrastructure_alerts').delete().eq('id', id);
    if (error) { console.error(error); return; }
    logAction('delete', 'alert', { id });
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const severityStyles: Record<string, string> = {
    critical: 'border-red-500/20 bg-red-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    info: 'border-sky-500/20 bg-sky-500/5',
  };
  const severityIcon: Record<string, string> = {
    critical: 'text-red-400',
    warning: 'text-amber-400',
    info: 'text-sky-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Budgets & Alerts</h2>
        </div>
        <p className="text-sm text-gray-500">Set monthly spending thresholds and monitor alerts.</p>
      </div>

      {/* Budgets Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Monthly Budgets
          </h3>
          <button
            onClick={() => { setEditingBudgetId(null); setBudgetForm({ category: 'api', monthly_limit_usd: 0, alert_threshold_pct: 80, is_active: true }); setShowBudgetForm(true); }}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Budget
          </button>
        </div>

        {showBudgetForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowBudgetForm(false)}>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{editingBudgetId ? 'Edit Budget' : 'Add Budget'}</h3>
                <button onClick={() => setShowBudgetForm(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleBudgetSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select value={budgetForm.category} onChange={e => setBudgetForm({ ...budgetForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    <option value="total">Total (All)</option>
                    <option value="api">API</option>
                    <option value="database">Database</option>
                    <option value="hosting">Hosting</option>
                    <option value="ai">AI</option>
                    <option value="domain">Domain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Monthly Limit (USD)</label>
                  <input type="number" step="0.01" required value={budgetForm.monthly_limit_usd} onChange={e => setBudgetForm({ ...budgetForm, monthly_limit_usd: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Alert Threshold (%)</label>
                  <input type="number" min="1" max="100" required value={budgetForm.alert_threshold_pct} onChange={e => setBudgetForm({ ...budgetForm, alert_threshold_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={budgetForm.is_active} onChange={e => setBudgetForm({ ...budgetForm, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                  Active
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : editingBudgetId ? 'Update' : 'Add'}
                  </button>
                  <button type="button" onClick={() => setShowBudgetForm(false)}
                    className="px-4 py-2.5 bg-gray-800 text-gray-400 rounded-lg text-sm hover:text-white">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {budgets.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <TrendingUp className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No budgets configured. Add one to track spending limits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(budget => {
              const spend = categorySpend(budget.category);
              const pct = budget.monthly_limit_usd > 0 ? Math.round((spend / budget.monthly_limit_usd) * 100) : 0;
              const isOverThreshold = pct >= budget.alert_threshold_pct;
              return (
                <div key={budget.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium capitalize">{budget.category}</h4>
                      {!budget.is_active && <span className="text-xs text-gray-600">(inactive)</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleBudgetEdit(budget.id, budget.category, budget.monthly_limit_usd, budget.alert_threshold_pct, budget.is_active)}
                        className="text-gray-500 hover:text-emerald-400 transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleBudgetDelete(budget.id, budget.category)}
                        className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl font-bold text-white">{formatCurrency(spend)}</span>
                    <span className="text-sm text-gray-500">of {formatCurrency(budget.monthly_limit_usd)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOverThreshold ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className={isOverThreshold ? 'text-red-400 font-medium' : 'text-gray-500'}>{pct}% used</span>
                    <span className="text-gray-600">Alert at {budget.alert_threshold_pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alerts Section */}
      <div>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-400" /> Active Alerts
        </h3>
        {alerts.length === 0 ? (
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
            <Bell className="w-10 h-10 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No alerts recorded.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`rounded-xl border p-4 ${alert.is_resolved ? 'border-gray-800 bg-gray-900/50 opacity-60' : severityStyles[alert.severity]}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${severityIcon[alert.severity]}`} />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${severityIcon[alert.severity]}`} />
                    ) : (
                      <Bell className={`w-5 h-5 flex-shrink-0 mt-0.5 ${severityIcon[alert.severity]}`} />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                        {alert.is_resolved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span className="capitalize">{alert.alert_type.replace(/_/g, ' ')}</span>
                        {alert.related_provider && <span>· {alert.related_provider}</span>}
                        <span>· {new Date(alert.triggered_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!alert.is_resolved && (
                      <button onClick={() => resolveAlert(alert.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-emerald-600/10 text-emerald-400 rounded text-xs hover:bg-emerald-600/20 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                      </button>
                    )}
                    <button onClick={() => deleteAlert(alert.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
