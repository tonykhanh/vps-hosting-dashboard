
import React from 'react';
import { ProjectStatus } from '../types';

interface BadgeProps {
  status: ProjectStatus | 'active' | 'inactive';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const styles: Record<string, string> = {
    [ProjectStatus.RUNNING]: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    [ProjectStatus.STOPPED]: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600/30",
    [ProjectStatus.PROVISIONING]: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    [ProjectStatus.BUILDING]: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    [ProjectStatus.ERROR]: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    'active': "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    'inactive': "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600/30",
  };

  const labels: Record<string, string> = {
    [ProjectStatus.RUNNING]: "Running",
    [ProjectStatus.STOPPED]: "Stopped",
    [ProjectStatus.PROVISIONING]: "Provisioning",
    [ProjectStatus.BUILDING]: "Building",
    [ProjectStatus.ERROR]: "Error",
    'active': "Active",
    'inactive': "Inactive",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['inactive']} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === ProjectStatus.RUNNING ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`}></span>
      {labels[status] || status}
    </span>
  );
};
