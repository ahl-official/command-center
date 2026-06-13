'use client';

import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { ShieldAlert } from 'lucide-react';

interface PriorityListProps {
  tasks: Task[];
  isTV?: boolean;
}

export function PriorityList({ tasks, isTV }: PriorityListProps) {
  if (tasks.length === 0) {
    return (
      <div className="glass-panel p-8 text-center border border-dashed border-border/50 bg-card/50">
        <ShieldAlert className="mx-auto text-text-muted mb-2" size={24} />
        <p className="text-text-secondary text-xs italic font-medium">No top priorities scheduled.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} isTV={isTV} />
      ))}
    </div>
  );
}
