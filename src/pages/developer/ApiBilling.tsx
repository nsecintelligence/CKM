import ServiceAccounts from './ServiceAccounts';
import { Code2 } from 'lucide-react';

export default function ApiBilling() {
  return (
    <ServiceAccounts
      category="api"
      title="API Billing & Usage"
      description="Monitor API provider costs, usage units, quotas, and rate limits."
      icon={Code2}
    />
  );
}
