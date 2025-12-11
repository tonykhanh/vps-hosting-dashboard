
import React, { useState, useMemo } from 'react';
import { 
  Server, LayoutGrid, Zap, Disc, FileCode, Key
} from 'lucide-react';
import { InfrastructureLayout } from '../components/Infrastructure/InfrastructureLayout';
import { InstancesList } from '../components/Infrastructure/compute/InstancesList';
import { KubernetesManager } from '../components/Infrastructure/compute/KubernetesManager';
import { IsoManager } from '../components/Infrastructure/compute/IsoManager';
import { SshKeyManager } from '../components/Infrastructure/compute/SshKeyManager';
import { ScriptManager } from '../components/Infrastructure/compute/ScriptManager';
import { ServerlessManager } from '../components/Infrastructure/compute/ServerlessManager';
import { DeployServerModal } from '../components/Infrastructure/compute/DeployServerModal';

export const VPS: React.FC = () => {
  const [subSection, setSubSection] = useState<'instances' | 'kubernetes' | 'serverless' | 'iso' | 'scripts' | 'ssh'>('instances');
  const [activeTab, setActiveTab] = useState('overview'); 
  const [showDeployModal, setShowDeployModal] = useState(false);

  const navItems = useMemo(() => [
    { 
      id: 'instances', 
      label: 'Instances', 
      icon: Server,
      desc: 'Virtual private servers.',
    },
    { 
      id: 'kubernetes', 
      label: 'Kubernetes', 
      icon: LayoutGrid,
      desc: 'Container orchestration.',
    },
    { 
      id: 'serverless', 
      label: 'Serverless', 
      icon: Zap, 
      badge: 'BETA',
      desc: 'Event-driven functions.',
    },
    { id: 'iso', label: 'ISOs', icon: Disc, desc: 'Custom images.' },
    { id: 'scripts', label: 'Scripts', icon: FileCode, desc: 'Startup automation.' },
    { id: 'ssh', label: 'SSH Keys', icon: Key, desc: 'Access credentials.' },
  ], []);

  return (
    <>
      <InfrastructureLayout
        title="Compute Cloud"
        description="Manage high-performance virtual machines, bare metal, and container clusters."
        icon={Server}
        navItems={navItems}
        activeSection={subSection}
        onSectionChange={setSubSection}
        primaryAction={subSection === 'instances' ? {
          label: 'Deploy New Instance',
          onClick: () => setShowDeployModal(true)
        } : undefined}
      >
         {subSection === 'instances' && <InstancesList activeTab={activeTab} />}
         {subSection === 'kubernetes' && <KubernetesManager />}
         {subSection === 'serverless' && <ServerlessManager />}
         {subSection === 'iso' && <IsoManager />}
         {subSection === 'ssh' && <SshKeyManager />}
         {subSection === 'scripts' && <ScriptManager />}
      </InfrastructureLayout>

      {showDeployModal && <DeployServerModal onClose={() => setShowDeployModal(false)} />}
    </>
  );
};
