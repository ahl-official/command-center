'use client';

import { Status } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    'done': {
      label: 'Done',
      classes: 'bg-success/10 text-success border-success/20',
    },
    'in-progress': {
      label: 'Active',
      classes: 'bg-accent/10 text-accent border-accent/20',
    },
    'pending': {
      label: 'Pending',
      classes: 'bg-warning/10 text-warning border-warning/20',
    },
    'delayed': {
      label: 'Delayed',
      classes: 'bg-danger/10 text-danger border-danger/20',
    },
    'delegated': {
      label: 'Delegated',
      classes: 'bg-secondary-container/20 text-on-secondary-container border-outline-variant/30',
    },
  };

  const config = statusConfig[status] || { label: status, classes: 'bg-zinc-800 text-zinc-400 border-zinc-700/50' };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-geist font-semibold tracking-wider uppercase border",
      config.classes,
      className
    )}>
      {config.label}
    </span>
  );
}
