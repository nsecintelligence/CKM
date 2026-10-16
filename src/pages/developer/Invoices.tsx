import { useState, useMemo } from 'react';
import { useDeveloperData, formatCurrency } from '../../hooks/useDeveloperData';
import { useLogDevAction } from '../../components/admin/DeveloperLayout';
import { supabase } from '../../lib/supabase';
import type { InfrastructureInvoice } from '../../types';
import {
  Plus, Trash2, Edit3, X, FileText, Download, Search, CheckCircle2, AlertCircle, Clock,
} from 'lucide-react';

export default function Invoices() {
  const { invoices, loading, refetch } = useDeveloperData();
  const logAction = useLogDevAction();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const emptyForm = {
    provider_name: '', service_category: 'api', invoice_number: '', amount: 0, currency: 'USD',
    amount_usd: 0, billing_period_start: new Date().toISOString().split('T')[0],
    billing_period_end: new Date().toISOString().split('T')[0], due_date: '', payment_status: 'unpaid',
    invoice_document_url: '', notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      if (filterCategory !== 'all' && inv.service_category !== filterCategory) return false;
      if (filterStatus !== 'all' && inv.payment_status !== filterStatus) return false;
      if (search && !inv.provider_name.toLowerCase().includes(search.toLowerCase()) &&
          !(inv.invoice_number || '').toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [invoices, filterCategory, filterStatus, search]);

  const totalOutstanding = invoices
    .filter(inv => inv.payment_status === 'unpaid' || inv.payment_status === 'overdue')
    .reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        provider_name: form.provider_name.trim(),
        service_category: form.service_category,
        invoice_number: form.invoice_number || null,
        amount: Number(form.amount) || 0,
        currency: form.currency,
        amount_usd: form.currency === 'USD' ? Number(form.amount) : (Number(form.amount_usd) || null),
        billing_period_start: form.billing_period_start,
        billing_period_end: form.billing_period_end,
        due_date: form.due_date || null,
        payment_status: form.payment_status,
        invoice_document_url: form.invoice_document_url || null,
        notes: form.notes || null,
        paid_at: form.payment_status === 'paid' ? new Date().toISOString() : null,
      };
      if (editingId) {
        const { error } = await supabase.from('infrastructure_invoices').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId);
        if (error) throw error;
        logAction('update', 'invoice', { id: editingId, provider: payload.provider_name });
      } else {
        const { error } = await supabase.from('infrastructure_invoices').insert(payload);
        if (error) throw error;
        logAction('create', 'invoice', { provider: payload.provider_name, amount: payload.amount });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete invoice for ${name}?`)) return;
    const { error } = await supabase.from('infrastructure_invoices').delete().eq('id', id);
    if (error) { console.error(error); return; }
    logAction('delete', 'invoice', { id, name });
    refetch();
  };

  const handleEdit = (inv: InfrastructureInvoice) => {
    setEditingId(inv.id);
    setForm({
      provider_name: inv.provider_name,
      service_category: inv.service_category,
      invoice_number: inv.invoice_number || '',
      amount: inv.amount,
      currency: inv.currency,
      amount_usd: inv.amount_usd || 0,
      billing_period_start: inv.billing_period_start,
      billing_period_end: inv.billing_period_end,
      due_date: inv.due_date || '',
      payment_status: inv.payment_status,
      invoice_document_url: inv.invoice_document_url || '',
      notes: inv.notes || '',
    });
    setShowForm(true);
  };

  const markPaid = async (inv: InfrastructureInvoice) => {
    const { error } = await supabase.from('infrastructure_invoices')
      .update({ payment_status: 'paid', paid_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', inv.id);
    if (error) { console.error(error); return; }
    logAction('update', 'invoice', { id: inv.id, action: 'mark_paid' });
    refetch();
  };

  const exportCSV = () => {
    const headers = ['Provider', 'Category', 'Invoice #', 'Amount', 'Currency', 'Amount USD', 'Period Start', 'Period End', 'Due Date', 'Status', 'Notes'];
    const rows = filtered.map(inv => [
      inv.provider_name, inv.service_category, inv.invoice_number || '',
      inv.amount, inv.currency, inv.amount_usd || '', inv.billing_period_start,
      inv.billing_period_end, inv.due_date || '', inv.payment_status, inv.notes || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    logAction('export', 'invoice', { count: filtered.length });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      unpaid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
      cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return styles[status] || styles.unpaid;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Invoice Management</h2>
          </div>
          <p className="text-sm text-gray-500">Track, filter, and export infrastructure invoices.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => { setEditingId(null); setForm(emptyForm); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Invoice
          </button>
        </div>
      </div>

      {/* Outstanding Summary */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-gray-400">Total Outstanding</span>
        </div>
        <span className="text-xl font-bold text-amber-400">{formatCurrency(totalOutstanding)}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search provider or invoice #..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-white text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="all">All Categories</option>
          <option value="api">API</option>
          <option value="database">Database</option>
          <option value="hosting">Hosting</option>
          <option value="ai">AI</option>
          <option value="domain">Domain</option>
          <option value="other">Other</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="all">All Status</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {formError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">{formError}</div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Invoice' : 'Add Invoice'}</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Provider Name</label>
                  <input required value={form.provider_name} onChange={e => setForm({ ...form, provider_name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Category</label>
                  <select value={form.service_category} onChange={e => setForm({ ...form, service_category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    <option value="api">API</option>
                    <option value="database">Database</option>
                    <option value="hosting">Hosting</option>
                    <option value="ai">AI</option>
                    <option value="domain">Domain</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Amount</label>
                  <input type="number" step="0.01" required value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Currency</label>
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    <option value="USD">USD</option>
                    <option value="TZS">TZS</option>
                  </select>
                </div>
                {form.currency !== 'USD' && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Amount (USD)</label>
                    <input type="number" step="0.01" value={form.amount_usd} onChange={e => setForm({ ...form, amount_usd: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Converted" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Invoice #</label>
                  <input value={form.invoice_number} onChange={e => setForm({ ...form, invoice_number: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Payment Status</label>
                  <select value={form.payment_status} onChange={e => setForm({ ...form, payment_status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Billing Period Start</label>
                  <input type="date" required value={form.billing_period_start} onChange={e => setForm({ ...form, billing_period_start: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Billing Period End</label>
                  <input type="date" required value={form.billing_period_end} onChange={e => setForm({ ...form, billing_period_end: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Invoice Document URL</label>
                <input type="url" value={form.invoice_document_url} onChange={e => setForm({ ...form, invoice_document_url: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="https://..." />
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

      {/* Invoice Table */}
      {filtered.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No invoices found. Add one to get started.</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Provider</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Period</th>
                  <th className="text-left px-4 py-3 font-medium">Due</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{inv.provider_name}</div>
                      {inv.invoice_number && <div className="text-xs text-gray-500">#{inv.invoice_number}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{inv.service_category}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-white font-medium">{formatCurrency(inv.amount, inv.currency)}</div>
                      {inv.amount_usd && inv.currency !== 'USD' && <div className="text-xs text-gray-500">{formatCurrency(inv.amount_usd)}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{inv.billing_period_start} → {inv.billing_period_end}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{inv.due_date || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${statusBadge(inv.payment_status)}`}>
                        {inv.payment_status === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                        {inv.payment_status === 'overdue' && <AlertCircle className="w-3 h-3" />}
                        {inv.payment_status === 'unpaid' && <Clock className="w-3 h-3" />}
                        {inv.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {inv.payment_status !== 'paid' && inv.payment_status !== 'cancelled' && (
                          <button onClick={() => markPaid(inv)} className="text-gray-500 hover:text-emerald-400 transition-colors" title="Mark as paid">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {inv.invoice_document_url && (
                          <a href={inv.invoice_document_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-400 transition-colors">
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => handleEdit(inv)} className="text-gray-500 hover:text-emerald-400 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(inv.id, inv.provider_name)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
