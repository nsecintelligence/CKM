import ServiceAccounts from './ServiceAccounts';
import { Database } from 'lucide-react';

export default function DatabaseSupabase() {
  return (
    <ServiceAccounts
      category="database"
      title="Database & Supabase"
      description="Track Supabase plan costs, storage, compute, egress, and backup expenses."
      icon={Database}
    />
  );
}
