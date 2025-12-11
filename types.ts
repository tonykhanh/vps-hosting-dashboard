export enum ProjectStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  BUILDING = 'BUILDING',
  ERROR = 'ERROR',
  PROVISIONING = 'PROVISIONING'
}

export enum BlueprintType {
  WORDPRESS = 'WORDPRESS',
  NODEJS = 'NODEJS',
  LARAVEL = 'LARAVEL',
  STATIC = 'STATIC',
  DOCKER = 'DOCKER'
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface ResourceMetrics {
  cpu: MetricPoint[];
  memory: MetricPoint[];
  network: MetricPoint[];
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  blueprint: BlueprintType;
  status: ProjectStatus;
  region: string;
  ip: string;
  createdAt: string;
  metrics: ResourceMetrics;
  healthScore: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface Blueprint {
  id: BlueprintType;
  name: string;
  description: string;
  icon: string;
  recommendedSize: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}