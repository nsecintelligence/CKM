import { useMemo, useState } from 'react';
import { useDeveloperData, currentMonthRange, isSameMonth, formatCurrency } from '../../hooks/useDeveloperData';
import { useLogDevAction } from '../../components/admin/DeveloperLayout';
import {
  DollarSign, Code2, Database, Cloud, Sparkles, TrendingUp, AlertTriangle,
  Calendar, RefreshCw,
} from 'lucide-react';

export default function DeveloperOverview() {
  const { serviceAccounts, usage, invoices, budgets, alerts, loading, refetch } = useDeveloperData();
  const logAction = useLogDevAction();
  const [dateRange, setDateRange] = useState<'this_month' | 'last_month' | 'last_3_months'>('this_month');

  const thisMonth = useMemo(() => currentMonthRange(), []);

  const stats = useMemo(() => {
    const monthInvoices = invoices.filter(inv => isSameMonth(inv.billing_period_start, thisMonth.start));
    const totalSpend = monthInvoices.reduce((sum, inv) => sum + (inv.amount_usd || inv.amount), 0);

    const apiAccounts = serviceAccounts.filter(a => a.category === 'api');
    const dbAccounts = serviceAccounts.filter(a => a.category === 'database');
    const hostingAccounts = serviceAccounts.filter(a => a.category === 'hosting');
    const aiAccounts = serviceAccounts.filter(a => a.category === 'ai');

    const apiSpend = monthInvoices.filter(inv => inv.service_category === 'api').reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);
    const dbSpend = monthInvoices.filter(inv => inv.service_category === 'database').reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);
    const hostingSpend = monthInvoices.filter(inv => inv.service_category === 'hosting').reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);
    const aiSpend = monthInvoices.filter(inv => inv.service_category === 'ai').reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);

    const outstanding = invoices.filter(inv => inv.payment_status === 'unpaid' || inv.payment_status === 'overdue')
      .reduce((s, inv) => s + (inv.amount_usd || inv.amount), 0);

    const overdueCount = invoices.filter(inv => inv.payment_status === 'overdue').length;

    const totalBudget = budgets.find(b => b.category === 'total' && b.is_active)?.monthly_limit_usd || 0;
    const budgetRemaining = totalBudget - totalSpend;
    const budgetPct = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

    const upcomingRenewals = invoices.filter(inv => {
      if (inv.payment_status === 'paid') return false;
      if (!inv.due_date) return false;
      const due = new Date(inv.due_date);
      const now = new Date();
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    });

    const activeAlerts = alerts.filter(a => !a.is_resolved);

    // Usage-based estimated costs for current month
    const estCosts = usage
      .filter(u => u.metric_type === 'estimated_cost_usd' && isSameMonth(u.billing_period_start, thisMonth.start))
      .reduce((s, u) => s + u.metric_value, 0);

    const actualCosts = usage
      .filter(u => u.metric_type === 'actual_cost_usd' && isSameMonth(u.billing_period_start, thisMonth.start))
      .reduce((s, u) => s + u.metric_value, 0);

    return {
      totalSpend, apiSpend, dbSpend, hostingSpend, aiSpend,
      outstanding, overdueCount, totalBudget, budgetRemaining, budgetPct,
      upcomingRenewals, activeAlerts, estCosts, actualCosts,
      apiAccounts, dbAccounts, hostingAccounts, aiAccounts,
    };
  }, [invoices, serviceAccounts, budgets, alerts, usage, thisMonth.start]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const summaryCards = [
    { label: 'Total Spend (This Month)', value: formatCurrency(stats.totalSpend), icon: DollarSign, color: 'emerald', sub: `${thisMonth.label}` },
    { label: 'API Costs', value: formatCurrency(stats.apiSpend), icon: Code2, color: 'sky', sub: `${stats.apiAccounts.length} provider(s)` },
    { label: 'Database Costs', value: formatCurrency(stats.dbSpend), icon: Database, color: 'blue', sub: `${stats.dbAccounts.length} service(s)` },
    { label: 'Hosting Costs', value: formatCurrency(stats.hostingSpend), icon: Cloud, color: 'cyan', sub: `${stats.hostingAccounts.length} provider(s)` },
    { label: 'AI Credits Used', value: formatCurrency(stats.aiSpend), icon: Sparkles, color: 'purple', sub: `${stats.aiAccounts.length} model(s)` },
    { label: 'Outstanding', value: formatCurrency(stats.outstanding), icon: AlertTriangle, color: stats.overdueCount > 0 ? 'red' : 'amber', sub: `${stats.overdueCount} overdue` },
  ];

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Infrastructure Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Monitoring costs, usage, and billing across all services</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
          </select>
          <button
            onClick={() => { refetch(); logAction('sync', 'overview'); }}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Budget Progress */}
      {stats.totalBudget > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium text-white">Monthly Budget</span>
            </div>
            <span className={`text-sm font-bold ${stats.budgetPct >= 80 ? 'text-red-400' : 'text-emerald-400'}`}>
              {stats.budgetPct}% used
            </span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${stats.budgetPct >= 80 ? 'bg-red-500' : 'bg-gradient-to-r from-emerald-500 to-green-600'}`}
              style={{ width: `${Math.min(stats.budgetPct, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{formatCurrency(stats.totalSpend)} spent</span>
            <span>{formatCurrency(stats.budgetRemaining)} remaining of {formatCurrency(stats.totalBudget)}</span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card, i) => {
          const c = colorClasses[card.color];
          const Icon = card.icon;
          return (
            <div key={i} className={`bg-gray-900 rounded-xl border ${c.border} p-5 hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.text} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-sm text-gray-400 mt-1">{card.label}</div>
              <div className="text-xs text-gray-600 mt-2">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Budget Remaining */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Upcoming Renewals</h3>
          </div>
          {stats.upcomingRenewals.length === 0 ? (
            <p className="text-sm text-gray-600">No upcoming renewals in the next 30 days.</p>
          ) : (
            <div className="space-y-2">
              {stats.upcomingRenewals.slice(0, 5).map(inv => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div>
                    <div className="text-sm text-white font-medium">{inv.provider_name}</div>
                    <div className="text-xs text-gray-500">Due: {inv.due_date}</div>
                  </div>
                  <div className="text-sm font-semibold text-amber-400">{formatCurrency(inv.amount_usd || inv.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
          </div>
          {stats.activeAlerts.length === 0 ? (
            <p className="text-sm text-gray-600">No active alerts. All systems normal.</p>
          ) : (
            <div className="space-y-2">
              {stats.activeAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-start gap-3 py-2 border-b border-gray-800 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                  <div>
                    <div className="text-sm text-white font-medium">{alert.title}</div>
                    <div className="text-xs text-gray-500">{alert.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estimated vs Actual */}
      {(stats.estCosts > 0 || stats.actualCosts > 0) && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Estimated vs Actual Costs (This Month)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Estimated</div>
              <div className="text-xl font-bold text-sky-400">{formatCurrency(stats.estCosts)}</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Actual (Provider-Reported)</div>
              <div className="text-xl font-bold text-emerald-400">{formatCurrency(stats.actualCosts)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
