import ServiceAccounts from './ServiceAccounts';
import { Sparkles } from 'lucide-react';

export default function AICredits() {
  return (
    <ServiceAccounts
      category="ai"
      title="AI Credits & Model Usage"
      description="Track AI provider token usage, prepaid credit balances, and estimated costs."
      icon={Sparkles}
    />
  );
}
