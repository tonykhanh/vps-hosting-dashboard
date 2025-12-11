
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { InfrastructureLayout } from '../components/Infrastructure/InfrastructureLayout';
import { DnsManager } from '../components/Infrastructure/network/DnsManager';

export const Domains: React.FC = () => {
  const [subSection, setSubSection] = useState<'dns'>('dns');

  const navItems = [
    { 
      id: 'dns', 
      label: 'DNS Zones', 
      icon: Globe,
      desc: 'Manage domains & records.',
    }
  ];

  return (
    <InfrastructureLayout
      title="Domains"
      description="Register domains and manage DNS zones with low-latency propagation."
      icon={Globe}
      navItems={navItems}
      activeSection={subSection}
      onSectionChange={setSubSection}
    >
       {subSection === 'dns' && <DnsManager />}
    </InfrastructureLayout>
  );
};
