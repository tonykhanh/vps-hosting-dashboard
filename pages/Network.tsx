
import React, { useState } from 'react';
import { 
  Network, Shield, Workflow, Lock, Route
} from 'lucide-react';
import { InfrastructureLayout } from '../components/Infrastructure/InfrastructureLayout';
import { FirewallManager } from '../components/Infrastructure/network/FirewallManager';
import { LoadBalancerManager } from '../components/Infrastructure/network/LoadBalancerManager';
import { ReservedIpManager } from '../components/Infrastructure/network/ReservedIpManager';
import { VpcManager } from '../components/Infrastructure/network/VpcManager';
import { BgpManager } from '../components/Infrastructure/network/BgpManager';

export const NetworkPage: React.FC = () => {
  const [subSection, setSubSection] = useState<'vpc' | 'firewall' | 'loadbalancers' | 'reserved_ips' | 'bgp'>('vpc');

  const navItems = [
    { 
      id: 'vpc', 
      label: 'VPC Networks', 
      icon: Network,
      desc: 'Private isolated networks.',
    },
    { 
      id: 'firewall', 
      label: 'Firewalls', 
      icon: Shield,
      desc: 'Security groups.',
    },
    { 
      id: 'loadbalancers', 
      label: 'Load Balancers', 
      icon: Workflow, 
      desc: 'Traffic distribution.',
    },
    { 
      id: 'reserved_ips', 
      label: 'Reserved IPs', 
      icon: Lock, 
      desc: 'Static IP addresses.',
    },
    { 
      id: 'bgp', 
      label: 'BGP Routing', 
      icon: Route, 
      desc: 'Global routing (BYOIP).',
    },
  ];

  return (
    <InfrastructureLayout
      title="Connectivity"
      description="Manage your cloud network architecture, security, and traffic flow."
      icon={Network}
      navItems={navItems}
      activeSection={subSection}
      onSectionChange={setSubSection}
    >
       {subSection === 'vpc' && <VpcManager />}
       {subSection === 'firewall' && <FirewallManager />}
       {subSection === 'loadbalancers' && <LoadBalancerManager />}
       {subSection === 'reserved_ips' && <ReservedIpManager />}
       {subSection === 'bgp' && <BgpManager />}
    </InfrastructureLayout>
  );
};
