import ServiceAccounts from './ServiceAccounts';
import { Cloud } from 'lucide-react';

export default function Hosting() {
  return (
    <ServiceAccounts
      category="hosting"
      title="Hosting & Domains"
      description="Monitor web hosting plans, domain renewals, and CDN costs."
      icon={Cloud}
    />
  );
}
