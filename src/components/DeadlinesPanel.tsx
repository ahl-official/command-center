'use client';

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface DeadlinesPanelProps {
  tasks: Task[];
  isTV?: boolean;
}

export function DeadlinesPanel({ tasks, isTV }: DeadlinesPanelProps) {
  // Filter for approaching deadlines (not done) and sort by nearest due dates first
  const deadlineTasks = tasks
    .filter(t => t.category === 'deadline' && t.status !== 'done')
    .sort((a, b) => {
      const dateCompare = a.dueDate.localeCompare(b.dueDate);
      if (dateCompare !== 0) return dateCompare;
      return (a.dueTime || '').localeCompare(b.dueTime || '');
    });

  // Calculate display label for hours/days left
  const getHoursLeft = (task: Task) => {
    const today = new Date().toISOString().split('T')[0];
    if (task.dueDate === today) {
      if (task.priority === 'urgent') return { val: '2H', urgent: true };
      if (task.priority === 'high') return { val: '6H', urgent: false };
      return { val: 'Today', urgent: false };
    }
    
    const taskDate = new Date(task.dueDate);
    const currDate = new Date(today);
    const diffTime = taskDate.getTime() - currDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0 && diffDays <= 7) {
      return { val: `${diffDays}D`, urgent: diffDays <= 2 };
    }
    return { val: task.dueDate.substring(5), urgent: false }; // e.g. "06-25"
  };

  return (
    <div className={cn(
      "glass-panel border-danger/10 bg-danger/5 p-6 border",
      isTV ? "p-8 flex-grow" : ""
    )}>
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-danger/25">
        <div className="flex items-center gap-2">
          <Calendar className="text-danger" size={16} />
          <h3 className="font-geist text-xs font-bold text-danger uppercase tracking-[0.2em]">
            Approaching Deadlines
          </h3>
        </div>
        <span className="font-geist text-[10px] font-bold text-danger uppercase tracking-widest bg-danger/10 px-2 py-0.5 rounded border border-danger/20">
          {deadlineTasks.length} Approaching
        </span>
      </div>

      <div className="space-y-3">
        {deadlineTasks.length === 0 ? (
          <p className="text-text-muted text-xs italic font-medium">No urgent deadlines approaching.</p>
        ) : (
          deadlineTasks.map(task => {
            const timeLeft = getHoursLeft(task);
            return (
              <div 
                key={task.id} 
                className="p-3 bg-background/50 border border-border/40 rounded-lg flex justify-between items-center gap-4 hover:border-danger/35 hover:bg-background/80 transition-all"
              >
                <div className="min-w-0">
                  <h4 className="font-geist text-xs font-bold text-text-primary truncate">
                    {task.title}
                  </h4>
                  <p className="font-inter text-[10px] text-text-secondary truncate mt-0.5 max-w-[150px] sm:max-w-[250px]">
                    {task.description || 'Action required'}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className={cn(
                    "font-geist text-sm font-extrabold tabular-nums",
                    timeLeft.urgent ? "text-danger animate-pulse" : "text-text-primary"
                  )}>
                    {timeLeft.val}
                  </p>
                  <p className="font-geist text-[8px] font-bold text-text-muted uppercase tracking-wider">
                    Left
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
