import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  DeveloperServiceAccount,
  InfrastructureUsage,
  InfrastructureInvoice,
  InfrastructureBudget,
  InfrastructureAlert,
  InfrastructureAuditLog,
} from '../types';

export function useDeveloperData() {
  const [serviceAccounts, setServiceAccounts] = useState<DeveloperServiceAccount[]>([]);
  const [usage, setUsage] = useState<InfrastructureUsage[]>([]);
  const [invoices, setInvoices] = useState<InfrastructureInvoice[]>([]);
  const [budgets, setBudgets] = useState<InfrastructureBudget[]>([]);
  const [alerts, setAlerts] = useState<InfrastructureAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<InfrastructureAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accountsRes, usageRes, invoicesRes, budgetsRes, alertsRes, logsRes] = await Promise.all([
        supabase.from('developer_service_accounts').select('*').order('created_at', { ascending: false }),
        supabase.from('infrastructure_usage').select('*').order('recorded_at', { ascending: false }),
        supabase.from('infrastructure_invoices').select('*').order('created_at', { ascending: false }),
        supabase.from('infrastructure_budgets').select('*').order('category'),
        supabase.from('infrastructure_alerts').select('*').order('triggered_at', { ascending: false }),
        supabase.from('infrastructure_audit_logs').select('*').order('created_at', { ascending: false }).limit(200),
      ]);

      if (accountsRes.error) throw accountsRes.error;
      if (usageRes.error) throw usageRes.error;
      if (invoicesRes.error) throw invoicesRes.error;
      if (budgetsRes.error) throw budgetsRes.error;
      if (alertsRes.error) throw alertsRes.error;
      if (logsRes.error) throw logsRes.error;

      setServiceAccounts(accountsRes.data || []);
      setUsage(usageRes.data || []);
      setInvoices(invoicesRes.data || []);
      setBudgets(budgetsRes.data || []);
      setAlerts(alertsRes.data || []);
      setAuditLogs(logsRes.data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    serviceAccounts,
    usage,
    invoices,
    budgets,
    alerts,
    auditLogs,
    loading,
    error,
    refetch: fetchAll,
  };
}

export function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    label: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  };
}

export function isSameMonth(dateStr: string, refDate: string) {
  const d = new Date(dateStr);
  const r = new Date(refDate);
  return d.getFullYear() === r.getFullYear() && d.getMonth() === r.getMonth();
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  if (currency === 'TZS') {
    return `${Math.round(amount).toLocaleString('en-US')} TZS`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
