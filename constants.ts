
import { Blueprint, BlueprintType, Project, ProjectStatus, LogEntry } from './types';
import { Layout, Globe, Server, Database, Box, Activity, Cpu, Layers, Zap, Disc, FileCode, Key } from 'lucide-react';

export const BLUEPRINTS: Blueprint[] = [
  {
    id: BlueprintType.WORDPRESS,
    name: 'WordPress E-Commerce',
    description: 'Optimized stack with Nginx, PHP 8.2, Redis Object Cache.',
    icon: 'shopping-cart',
    recommendedSize: '2 vCPU / 4GB RAM',
  },
  {
    id: BlueprintType.NODEJS,
    name: 'Node.js App API',
    description: 'PM2 managed, auto-scaling ready, Node 18 LTS.',
    icon: 'server',
    recommendedSize: '1 vCPU / 2GB RAM',
  },
  {
    id: BlueprintType.LARAVEL,
    name: 'Laravel Enterprise',
    description: 'PHP 8.3, Composer, Supervisor queue worker configured.',
    icon: 'layers',
    recommendedSize: '2 vCPU / 4GB RAM',
  },
  {
    id: BlueprintType.STATIC,
    name: 'Static Frontend',
    description: 'High performance Nginx static serving with global CDN.',
    icon: 'layout',
    recommendedSize: '1 vCPU / 1GB RAM',
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p-new',
    name: 'New E-Commerce Store',
    domain: 'pending-allocation...',
    blueprint: BlueprintType.WORDPRESS,
    status: ProjectStatus.PROVISIONING,
    region: 'sg-1',
    ip: 'Allocating...',
    createdAt: new Date().toISOString(),
    healthScore: 100,
    metrics: {
      cpu: [],
      memory: [],
      network: [],
    }
  },
  {
    id: 'p-101',
    name: 'Nexus Shop Main',
    domain: 'shop.nexus-agency.com',
    blueprint: BlueprintType.WORDPRESS,
    status: ProjectStatus.RUNNING,
    region: 'sg-1',
    ip: '104.22.15.192',
    createdAt: '2024-03-10T08:00:00Z',
    healthScore: 98,
    metrics: {
      cpu: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 20 + Math.random() * 30 })),
      memory: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 40 + Math.random() * 10 })),
      network: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 10 + Math.random() * 50 })),
    }
  },
  {
    id: 'p-102',
    name: 'Client Portal API',
    domain: 'api.client-portal.io',
    blueprint: BlueprintType.NODEJS,
    status: ProjectStatus.RUNNING,
    region: 'vn-1',
    ip: '103.11.22.33',
    createdAt: '2024-04-15T10:30:00Z',
    healthScore: 100,
    metrics: {
      cpu: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 10 + Math.random() * 10 })),
      memory: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 30 + Math.random() * 5 })),
      network: Array.from({ length: 20 }, (_, i) => ({ time: `${i}:00`, value: 5 + Math.random() * 20 })),
    }
  },
  {
    id: 'p-103',
    name: 'Campaign Lander',
    domain: 'summer-sale.brand.com',
    blueprint: BlueprintType.STATIC,
    status: ProjectStatus.STOPPED,
    region: 'us-west',
    ip: '192.168.1.50',
    createdAt: '2024-05-20T14:15:00Z',
    healthScore: 85,
    metrics: {
      cpu: [],
      memory: [],
      network: [],
    }
  }
];

export const MOCK_LOGS: LogEntry[] = [
  { id: 'l-1', timestamp: '10:42:15', level: 'INFO', message: 'Health check passed. Latency: 45ms' },
  { id: 'l-2', timestamp: '10:40:00', level: 'SUCCESS', message: 'Backup created: snap-2024-05-24-1040' },
  { id: 'l-3', timestamp: '10:35:12', level: 'INFO', message: 'Auto-scaling: CPU usage normal' },
  { id: 'l-4', timestamp: '09:15:00', level: 'WARN', message: 'High memory usage detected (85%)' },
  { id: 'l-5', timestamp: '09:00:00', level: 'INFO', message: 'System updated to kernel 6.5.0' },
];

export const SYSTEM_INSTRUCTION = `You are "Autonix AI", a DevOps and Cloud Infrastructure expert for the Autonix Cloud Platform. 
Your goal is to help users manage their cloud resources, debug deployment issues, and explain technical concepts simply.
Users are SMEs and Agencies who want "Simplicity > Flexibility".
Always be concise, professional, and helpful.
If a user asks to deploy something, guide them to the "New Project" wizard or explain the blueprint options.
If a user asks about an error, ask for logs or specific error messages.
Do not hallucinate features not present in standard VPS management (like SSH, DNS, SSL, Backup).
You have access to the context that the user is currently viewing the Autonix Dashboard.`;

// --- COMPUTE MOCK DATA ---

export const COMPUTE_TYPES = [
  { id: 'shared', name: 'Shared CPU', desc: 'Balanced performance for general workloads', icon: Cpu },
  { id: 'dedicated', name: 'Dedicated CPU', desc: 'Guaranteed resources for production apps', icon: Layers },
  { id: 'bare_metal', name: 'Bare Metal', desc: 'Direct access to physical hardware', icon: Server },
  { id: 'gpu', name: 'Cloud GPU', desc: 'Accelerated computing for AI/ML', icon: Zap },
];

export const K8S_VERSIONS = [
  'v1.34.1+2',
  'v1.33.5+1',
  'v1.32.2+3'
];

export const LOCATIONS = [
  { id: 'us-e', name: 'New York', region: 'Americas', flag: '🇺🇸' },
  { id: 'us-w', name: 'Los Angeles', region: 'Americas', flag: '🇺🇸' },
  { id: 'us-a', name: 'Atlanta', region: 'Americas', flag: '🇺🇸' },
  { id: 'us-c', name: 'Chicago', region: 'Americas', flag: '🇺🇸' },
  { id: 'br', name: 'São Paulo', region: 'Americas', flag: '🇧🇷' },
  { id: 'de', name: 'Frankfurt', region: 'Europe', flag: '🇩🇪' },
  { id: 'uk', name: 'London', region: 'Europe', flag: '🇬🇧' },
  { id: 'fr', name: 'Paris', region: 'Europe', flag: '🇫🇷' },
  { id: 'nl', name: 'Amsterdam', region: 'Europe', flag: '🇳🇱' },
  { id: 'sg', name: 'Singapore', region: 'Asia', flag: '🇸🇬' },
  { id: 'jp', name: 'Tokyo', region: 'Asia', flag: '🇯🇵' },
  { id: 'in', name: 'Mumbai', region: 'Asia', flag: '🇮🇳' },
  { id: 'kr', name: 'Seoul', region: 'Asia', flag: '🇰🇷' },
  { id: 'au', name: 'Sydney', region: 'Oceania', flag: '🇦🇺' },
];

export const REGIONS = ['Americas', 'Europe', 'Asia', 'Oceania'];

export const IMAGES = {
  os: [
    { id: 'alma', name: 'AlmaLinux', versions: ['9 x64', '8 x64'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg' },
    { id: 'alpine', name: 'Alpine Linux', versions: ['Latest x64', '3.18 x64'], icon: 'https://avatars.githubusercontent.com/u/7623954?s=200&v=4' },
    { id: 'arch', name: 'Arch Linux', versions: ['Latest x64'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/archlinux/archlinux-original.svg' },
    { id: 'centos', name: 'CentOS', versions: ['Stream 9', '7'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/centos/centos-original.svg' },
    { id: 'debian', name: 'Debian', versions: ['12 (Bookworm)', '11 (Bullseye)'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/debian/debian-original.svg' },
    { id: 'fedora', name: 'Fedora', versions: ['39', '38'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fedora/fedora-original.svg' },
    { id: 'rocky', name: 'Rocky Linux', versions: ['9', '8'], icon: 'https://cdn2.fptshop.com.vn/unsafe/Uploads/images/tin-tuc/178817/Originals/Rocky-Linux.jpg' },
    { id: 'ubuntu', name: 'Ubuntu', versions: ['24.04 LTS', '22.04 LTS', '20.04 LTS'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg' },
    { id: 'windows', name: 'Windows', versions: ['2022 Standard', '2019 Standard'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg', extraCost: 14 },
    { id: 'freebsd', name: 'FreeBSD', versions: ['14', '13'], icon: 'https://www.ateamsystems.com/wp-content/uploads/2016/11/freebsd-logo.png' },
    { id: 'openbsd', name: 'OpenBSD', versions: ['7.4', '7.3'], icon: 'https://comptoir-du-libre.org/img/files/Softwares/116/photo/avatar/openbsd.jpg' },
  ],
  apps: [
    { id: 'docker', name: 'Docker', versions: ['Latest on Ubuntu 22.04'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { id: 'wordpress', name: 'WordPress', versions: ['Latest on Ubuntu 22.04'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg' },
    { id: 'lamp', name: 'LAMP Stack', versions: ['PHP 8.2'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { id: 'cpanel', name: 'cPanel', versions: ['Latest'], icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/CPanel_logo.svg', extraCost: 20 },
    { id: 'plesk', name: 'Plesk', versions: ['Obsidian'], icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Plesk_Logo.svg/2560px-Plesk_Logo.svg.png' },
    { id: 'gitlab', name: 'GitLab', versions: ['Latest'], icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg' },
  ],
  isoLibrary: [
    { id: 'finnix', name: 'Finnix', version: '124 x64', icon: Disc },
    { id: 'gparted', name: 'GParted', version: '1.4.0-5 x64', icon: Disc },
    { id: 'hirens', name: 'Hiren\'s BootCD PE', version: '1.0.2 x64', icon: Disc },
    { id: 'systemrescue', name: 'SystemRescue', version: '9.03 x64', icon: Disc },
  ]
};

export const PLAN_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'cloud_compute', label: 'Cloud Compute' },
  { id: 'high_frequency', label: 'High Frequency' },
  { id: 'high_performance', label: 'High Performance' },
];

export const PLANS_DATA = [
  { id: 'voc-c-1c-1gb-25s', name: 'voc-c-1c-1gb-25s', vcpu: 1, ram: '1 GB', disk: '25 GB NVMe', bandwidth: '1 TB', price: 5, category: 'cloud_compute' },
  { id: 'voc-c-1c-2gb-50s', name: 'voc-c-1c-2gb-50s', vcpu: 1, ram: '2 GB', disk: '50 GB NVMe', bandwidth: '2 TB', price: 10, category: 'cloud_compute' },
  { id: 'voc-c-2c-4gb-80s', name: 'voc-c-2c-4gb-80s', vcpu: 2, ram: '4 GB', disk: '80 GB NVMe', bandwidth: '3 TB', price: 20, category: 'cloud_compute' },
  { id: 'vhf-1c-1gb-32s', name: 'vhf-1c-1gb-32s', vcpu: 1, ram: '1 GB', disk: '32 GB NVMe', bandwidth: '1 TB', price: 6, category: 'high_frequency' },
  { id: 'vhf-1c-2gb-64s', name: 'vhf-1c-2gb-64s', vcpu: 1, ram: '2 GB', disk: '64 GB NVMe', bandwidth: '2 TB', price: 12, category: 'high_frequency' },
  { id: 'vhf-2c-4gb-120s', name: 'vhf-2c-4gb-120s', vcpu: 2, ram: '4 GB', disk: '120 GB NVMe', bandwidth: '3 TB', price: 24, category: 'high_frequency' },
  { id: 'vhp-2c-8gb-intel', name: 'vhp-2c-8gb-intel', vcpu: 2, ram: '8 GB', disk: '120 GB NVMe', bandwidth: '4 TB', price: 40, category: 'high_performance' },
  { id: 'vhp-4c-16gb-amd', name: 'vhp-4c-16gb-amd', vcpu: 4, ram: '16 GB', disk: '250 GB NVMe', bandwidth: '5 TB', price: 80, category: 'high_performance' },
  { id: 'vhp-12c-24gb', name: 'vhp-12c-24gb', vcpu: 12, ram: '24 GB', disk: '500 GB NVMe', bandwidth: '12 TB', price: 144, category: 'high_performance' },
  { id: 'vc2-8c-32gb', name: 'vc2-8c-32gb', vcpu: 8, ram: '32 GB', disk: '640 GB SSD', bandwidth: '6 TB', price: 160, category: 'cloud_compute' },
  { id: 'vhf-8c-32gb', name: 'vhf-8c-32gb', vcpu: 8, ram: '32 GB', disk: '512 GB NVMe', bandwidth: '7 TB', price: 192, category: 'high_frequency' },
  { id: 'vhf-12c-48gb', name: 'vhf-12c-48gb', vcpu: 12, ram: '48 GB', disk: '768 GB NVMe', bandwidth: '8 TB', price: 256, category: 'high_frequency' },
  { id: 'vc2-16c-64gb', name: 'vc2-16c-64gb', vcpu: 16, ram: '64 GB', disk: '1280 GB SSD', bandwidth: '10 TB', price: 320, category: 'cloud_compute' },
  { id: 'vhf-16c-58gb', name: 'vhf-16c-58gb', vcpu: 16, ram: '58 GB', disk: '1024 GB NVMe', bandwidth: '9 TB', price: 320, category: 'high_frequency' },
  { id: 'vc2-24c-96gb', name: 'vc2-24c-96gb', vcpu: 24, ram: '96 GB', disk: '1600 GB SSD', bandwidth: '15 TB', price: 640, category: 'cloud_compute' },
];

export const SSH_KEYS = [
  { id: 'ssh-1', name: 'MacBook Pro - Personal' },
  { id: 'ssh-2', name: 'Dev Team Key' },
];

export const STARTUP_SCRIPTS = [
  { id: 'none', name: 'None' },
  { id: 'docker', name: 'Install Docker' },
  { id: 'update', name: 'System Update & Upgrade' },
];

export const FIREWALL_GROUPS = [
  { id: 'none', name: 'No Firewall Group' },
  { id: 'web', name: 'Web Server (80/443)' },
  { id: 'db', name: 'Database Only (Private)' },
];

export const DOMAIN_LIST = [
  { id: 'd-1', name: 'nexus-agency.com', registrar: 'Namecheap', expiry: '2025-10-12', ssl: 'valid', autoRenew: true, dnsStatus: 'healthy', nameservers: 'Cloudflare', target: '104.22.15.192' },
  { id: 'd-2', name: 'client-portal.io', registrar: 'GoDaddy', expiry: '2024-06-01', ssl: 'warning', autoRenew: false, dnsStatus: 'warning', nameservers: 'Default', target: '10.0.0.5' },
  { id: 'd-3', name: 'dev-test.site', registrar: 'Cloudflare', expiry: '2024-12-30', ssl: 'valid', autoRenew: true, dnsStatus: 'healthy', nameservers: 'Cloudflare', target: '192.168.1.50' },
];

export const DNS_RECORDS = [
  { id: 'r-1', type: 'A', name: '@', value: '104.22.15.192', ttl: '3600', priority: 0 },
  { id: 'r-2', type: 'CNAME', name: 'www', value: 'nexus-agency.com', ttl: '3600', priority: 0 },
  { id: 'r-3', type: 'MX', name: '@', value: 'mail.protonmail.com', ttl: '14400', priority: 10 },
];

export const FIREWALL_LIST = [
  { id: 'fw-1', name: 'Web Server (Public)', rulesIn: 3, rulesOut: 1, instances: 5, created: '2023-11-15' },
  { id: 'fw-2', name: 'Database (Private)', rulesIn: 1, rulesOut: 0, instances: 2, created: '2023-10-01' },
  { id: 'fw-3', name: 'SSH & Admin', rulesIn: 2, rulesOut: 5, instances: 8, created: '2024-01-20' },
];

export const VPS_LIST = [
  { 
    id: 'vps-1', 
    name: 'Web Server - Prod', 
    plan: 'VOC-C-2C-4GB',
    os: 'Ubuntu 22.04',
    osIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-plain.svg',
    ip: '104.22.15.192', 
    region: 'sg-1', 
    flag: '🇸🇬',
    cpu: 45, 
    ram: 60, 
    disk: 35, 
    status: ProjectStatus.RUNNING, 
    uptime: '14d 2h',
    tags: ['production', 'web'],
    cost: 14.50,
    backup: '2h ago',
    firewall: 'Web-Public (80/443)'
  },
  { 
    id: 'vps-2', 
    name: 'Database Primary', 
    plan: 'VHF-2C-4GB',
    os: 'Debian 11',
    osIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/debian/debian-original.svg',
    ip: '10.0.0.5', 
    region: 'sg-1', 
    flag: '🇸🇬',
    cpu: 12, 
    ram: 45, 
    disk: 78, 
    status: ProjectStatus.RUNNING, 
    uptime: '45d 10h',
    tags: ['database', 'internal'],
    cost: 28.20,
    backup: '10m ago',
    firewall: 'DB-Private (5432)'
  },
  { 
    id: 'vps-3', 
    name: 'Staging Worker', 
    plan: 'VOC-C-1C-1GB',
    os: 'DockerOS',
    osIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    ip: '192.168.1.50', 
    region: 'us-west', 
    flag: '🇺🇸',
    cpu: 0, 
    ram: 0, 
    disk: 10, 
    status: ProjectStatus.STOPPED, 
    uptime: '-',
    tags: ['staging'],
    cost: 4.10,
    backup: 'Disabled',
    firewall: 'Default-Allow-All'
  },
];
