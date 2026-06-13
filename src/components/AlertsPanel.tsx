'use client';

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Info } from 'lucide-react';

interface AlertsPanelProps {
  tasks: Task[];
  isTV?: boolean;
}

export function AlertsPanel({ tasks, isTV }: AlertsPanelProps) {
  // Filter for active alerts: not done, and (category alert, or priority urgent, or status delayed)
  const alertTasks = tasks
    .filter(t => t.status !== 'done' && (t.category === 'alert' || t.priority === 'urgent' || t.status === 'delayed'))
    .sort((a, b) => {
      // Sort urgent first, then delayed, then generic alert category
      const getWeight = (t: Task) => {
        let weight = 0;
        if (t.priority === 'urgent') weight += 10;
        if (t.status === 'delayed') weight += 5;
        if (t.category === 'alert') weight += 2;
        return weight;
      };
      return getWeight(b) - getWeight(a);
    });

  if (alertTasks.length === 0) {
    return (
      <div className={cn(
        "glass-panel bg-card border border-border p-6",
        isTV ? "p-8" : ""
      )}>
        <div className="flex items-center gap-2 mb-4">
          <Info className="text-accent" size={16} />
          <h3 className="font-geist text-xs font-bold text-text-muted uppercase tracking-[0.2em]">
            Urgent Alerts
          </h3>
        </div>
        <p className="text-text-muted text-xs italic font-medium">All systems operational. No active alerts.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "glass-panel bg-card border border-border p-6",
      isTV ? "p-8" : ""
    )}>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-danger animate-pulse" size={16} />
          <h3 className="font-geist text-xs font-bold text-text-muted uppercase tracking-[0.2em]">
            Urgent Alerts
          </h3>
        </div>
        <span className="font-geist text-[10px] font-bold text-danger uppercase tracking-widest bg-danger/10 px-2 py-0.5 rounded border border-danger/20">
          {alertTasks.length} Alerts
        </span>
      </div>

      <div className="space-y-3">
        {alertTasks.map(task => {
          const isCritical = task.priority === 'urgent' || task.status === 'delayed';
          
          return (
            <div 
              key={task.id} 
              className={cn(
                "flex gap-3 p-3 rounded-lg border transition-all",
                isCritical 
                  ? "bg-danger/10 border-danger/20 hover:border-danger/40" 
                  : "bg-warning/10 border-warning/20 hover:border-warning/40"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                <AlertTriangle size={14} className={isCritical ? "text-danger" : "text-warning"} />
              </div>

              <div className="flex-grow min-w-0">
                <p className={cn(
                  "font-geist text-[9px] font-bold uppercase tracking-wider mb-0.5",
                  isCritical ? "text-danger" : "text-warning"
                )}>
                  {task.status === 'delayed' ? 'Delayed Operation' : task.priority === 'urgent' ? 'System Critical' : 'Priority Alert'}
                </p>
                <p className="font-inter text-xs text-text-primary leading-normal font-semibold">
                  {task.title}
                </p>
                {task.description && (
                  <p className="font-inter text-[11px] text-text-secondary mt-1 leading-normal">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2 text-text-muted font-geist text-[9px] font-bold uppercase tracking-wide">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span className="tabular-nums">{task.dueTime || 'ASAP'}</span>
                  </div>
                  <span>•</span>
                  <span>{task.dueDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
