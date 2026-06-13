'use client';

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, User } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  isTV?: boolean;
}

export function TaskCard({ task, isTV }: TaskCardProps) {
  return (
    <div className={cn(
      "glass-panel bg-card border border-border rounded-xl transition-all hover:bg-card-elevated hover:border-accent/30 flex flex-col justify-between",
      isTV ? "p-6 space-y-4" : "p-4 space-y-3"
    )}>
      <div>
        <div className="flex justify-between items-center mb-3">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>
        
        <h3 className={cn(
          "font-geist font-bold text-text-primary tracking-tight leading-snug group-hover:text-accent transition-colors",
          isTV ? "text-xl" : "text-sm"
        )}>
          {task.title}
        </h3>
        
        {task.description && !isTV && (
          <p className="text-text-secondary font-inter text-xs font-normal leading-normal mt-1.5 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-border/60 text-text-muted mt-2">
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-accent" />
          <span className="font-geist text-[10px] font-semibold tabular-nums">
            {task.dueTime || 'ASAP'}
          </span>
        </div>
        
        {task.owner && (
          <div className="flex items-center gap-1 bg-card-elevated px-2 py-0.5 rounded border border-border/40 text-[9px] font-geist font-bold uppercase tracking-wider text-text-secondary">
            <User size={10} />
            <span>{task.owner}</span>
          </div>
        )}
      </div>
    </div>
  );
}
