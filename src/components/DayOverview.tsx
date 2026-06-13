'use client';

import { SupabaseTask } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';

interface DayOverviewProps {
  supabaseTasks: SupabaseTask[];
  progress: number;
  currentTime: Date;
  onClose: () => void;
}

export function DayOverview({ 
  supabaseTasks, 
  progress, 
  currentTime, 
  onClose 
}: DayOverviewProps) {
  
  const parseTimeToSeconds = (timeStr: string | null) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts.length > 2 ? parseInt(parts[2], 10) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  const currentTotalSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();

  const completedTasks = supabaseTasks.filter(task => {
    if (task.status === 'done') return true;
    if (!task.start_time) return false;
    const start = parseTimeToSeconds(task.start_time);
    if (start === null) return false;
    const duration = task.end_time ? (parseTimeToSeconds(task.end_time)! - start) : 3600;
    const end = start + duration;
    return currentTotalSeconds >= end;
  });

  const remainingTasks = supabaseTasks.filter(task => {
    if (task.status === 'done') return false;
    if (!task.start_time) return true;
    const start = parseTimeToSeconds(task.start_time);
    if (start === null) return true;
    const duration = task.end_time ? (parseTimeToSeconds(task.end_time)! - start) : 3600;
    const end = start + duration;
    return currentTotalSeconds < end;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 sm:p-12 max-w-5xl mx-auto flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <header className="border-b border-border pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-geist text-3xl sm:text-4xl font-extrabold tracking-tight text-accent uppercase">
            Day Overview
          </h1>
          <p className="font-geist text-xs text-text-secondary tracking-widest uppercase mt-1">
            15-second execution summary
          </p>
        </div>
        <div className="text-right">
          <span className="font-geist text-xs text-text-muted uppercase tracking-wider block">Target Date</span>
          <span className="font-geist text-sm font-bold text-text-primary uppercase tracking-wide">
            {formatDate(currentTime)}
          </span>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <section className="grid grid-cols-3 gap-4 sm:gap-6 my-8">
        <div className="glass-panel p-5 bg-card border border-border rounded-xl text-center">
          <span className="font-geist text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">
            Completed Tasks
          </span>
          <span className="font-geist text-4xl font-black text-success tabular-nums">
            {completedTasks.length}
          </span>
        </div>

        <div className="glass-panel p-5 bg-card border border-border rounded-xl text-center">
          <span className="font-geist text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">
            Remaining Tasks
          </span>
          <span className="font-geist text-4xl font-black text-warning tabular-nums">
            {remainingTasks.length}
          </span>
        </div>

        <div className="glass-panel p-5 bg-card border border-border rounded-xl text-center">
          <span className="font-geist text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">
            Progress Rate
          </span>
          <span className="font-geist text-4xl font-black text-accent tabular-nums">
            {progress}%
          </span>
        </div>
      </section>

      {/* Full Day Schedule Timeline */}
      <section className="flex-grow space-y-3 overflow-y-auto max-h-[50vh] pr-2 mb-8">
        <h2 className="font-geist text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">
          Complete Operational Schedule
        </h2>
        
        <div className="space-y-3">
          {supabaseTasks.map(task => {
            const isCompleted = completedTasks.some(t => t.id === task.id);
            
            return (
              <div 
                key={task.id}
                className={cn(
                  "glass-panel p-4 border rounded-xl flex items-center justify-between gap-4",
                  isCompleted ? "border-success/20 bg-success/2 opacity-75" : "border-border/60 bg-card"
                )}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Time Block */}
                  <div className={cn(
                    "flex-shrink-0 text-center w-16 bg-background/50 border rounded-lg p-1.5 flex flex-col justify-center",
                    isCompleted && "border-success/20"
                  )}>
                    <span className={cn("font-geist text-[10px] font-bold block tabular-nums", isCompleted ? "text-success" : "text-text-primary")}>
                      {task.start_time || 'ASAP'}
                    </span>
                    {task.end_time && (
                      <span className="text-[8px] font-semibold text-text-muted mt-0.5 border-t border-border/30 pt-0.5 tabular-nums">
                        {task.end_time}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className={cn("font-geist font-bold text-sm text-text-primary truncate", isCompleted && "text-text-muted line-through")}>
                      {task.title}
                    </h4>
                    <span className="text-[9px] font-geist text-text-secondary uppercase tracking-wider">
                      Priority: {task.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn(
                    "text-[8px] font-geist font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                    isCompleted ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"
                  )}>
                    {isCompleted ? 'Completed' : 'Remaining'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer info */}
      <footer className="border-t border-border/40 pt-4 flex justify-between items-center text-text-muted font-geist font-bold uppercase tracking-widest text-[10px]">
        <span>Live Operational Summary</span>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-card hover:bg-card-elevated border border-border text-text-secondary hover:text-text-primary rounded transition-colors cursor-pointer"
        >
          Return to Dashboard
        </button>
      </footer>
    </div>
  );
}
