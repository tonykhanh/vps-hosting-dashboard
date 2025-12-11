
import React, { useState } from 'react';
import { useLocation } from '../context/ThemeContext';
import { 
  HardDrive, Box, FolderOpen, Database
} from 'lucide-react';
import { InfrastructureLayout } from '../components/Infrastructure/InfrastructureLayout';
import { BlockStorageManager } from '../components/Infrastructure/storage/BlockStorageManager';
import { ObjectStorageManager } from '../components/Infrastructure/storage/ObjectStorageManager';
import { FileSystemManager } from '../components/Infrastructure/storage/FileSystemManager';

export const Storage: React.FC = () => {
  const location = useLocation();
  const [subSection, setSubSection] = useState<'block' | 'object' | 'files'>(
    location.pathname.startsWith('/s3') ? 'object' : 'block'
  );

  const navItems = [
    { 
      id: 'block', 
      label: 'Block Storage', 
      icon: HardDrive,
      desc: 'High-performance volumes.',
    },
    { 
      id: 'object', 
      label: 'Object Storage', 
      icon: Box,
      desc: 'S3-compatible buckets.',
    },
    { 
      id: 'files', 
      label: 'File System', 
      icon: FolderOpen,
      desc: 'Scalable network storage.',
    },
  ];

  return (
    <InfrastructureLayout
      title="Cloud Storage"
      description="Unified storage solutions for every workload. Persistent, scalable, and secure."
      icon={Database}
      navItems={navItems}
      activeSection={subSection}
      onSectionChange={setSubSection}
    >
       {subSection === 'block' && <BlockStorageManager />}
       {subSection === 'object' && <ObjectStorageManager />}
       {subSection === 'files' && <FileSystemManager />}
    </InfrastructureLayout>
  );
};
