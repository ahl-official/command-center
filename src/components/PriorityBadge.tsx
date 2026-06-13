'use client';

import { Priority } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityConfig = {
    'low': {
      label: 'Low',
      classes: 'bg-secondary-container/10 text-on-secondary-container border-outline/20',
    },
    'medium': {
      label: 'Medium',
      classes: 'bg-primary-container/10 text-primary border-primary-container/20',
    },
    'high': {
      label: 'High',
      classes: 'bg-warning/10 text-warning border-warning/20',
    },
    'urgent': {
      label: 'Urgent',
      classes: 'bg-danger/10 text-danger border-danger/20',
    },
  };

  const config = priorityConfig[priority] || { label: priority, classes: 'bg-zinc-800 text-zinc-400 border-zinc-700/50' };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-geist font-bold tracking-wider uppercase border",
      config.classes,
      className
    )}>
      {config.label}
    </span>
  );
}
