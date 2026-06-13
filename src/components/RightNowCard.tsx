'use client';

import { SupabaseTask } from '@/lib/supabase/types';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';

interface RightNowCardProps {
  task?: SupabaseTask | null;
  nextTask?: SupabaseTask | null;
  isDayComplete?: boolean;
  countdownText?: string;
  supabaseTasksCount?: number;
  className?: string;
  isTV?: boolean;
}

export function RightNowCard({ 
  task, 
  nextTask, 
  isDayComplete, 
  countdownText, 
  supabaseTasksCount = 0, 
  className, 
  isTV 
}: RightNowCardProps) {
  
  // Case A: No published tasks at all
  if (supabaseTasksCount === 0) {
    return (
      <div className={cn(
        "glass-panel p-6 md:p-10 flex flex-col items-center justify-center text-center border border-border bg-card",
        isTV ? "h-full min-h-[380px]" : "min-h-[200px]",
        className
      )}>
        <span className="material-symbols-outlined text-text-muted text-4xl md:text-5xl mb-4" data-icon="terminal">terminal</span>
        <p className={cn("text-text-secondary font-geist font-bold uppercase tracking-widest", isTV ? "text-2xl" : "text-xs md:text-sm")}>
          No active focus
        </p>
        <p className={cn("text-text-muted mt-2 max-w-sm", isTV ? "text-lg" : "text-[11px] md:text-xs")}>
          Select and publish today&apos;s schedule tasks in the Planner to deploy.
        </p>
      </div>
    );
  }

  // Case D: Day Complete
  if (isDayComplete) {
    return (
      <div className={cn(
        "glass-panel p-5 md:p-12 flex flex-col justify-between items-center text-center relative overflow-hidden border border-border bg-card",
        isTV ? "h-full min-h-[380px]" : "min-h-[240px]",
        className
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-border/20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-t border-l border-border/20 pointer-events-none" />
        
        <div className="my-auto flex flex-col items-center">
          <span className="material-symbols-outlined text-success text-5xl mb-4" data-icon="task_alt">task_alt</span>
          <h3 className={cn(
            "font-geist font-bold text-success tracking-tight leading-tight mb-2",
            isTV ? "text-5xl lg:text-6xl" : "text-xl sm:text-2xl md:text-3xl"
          )}>
            Day Complete
          </h3>
          <p className="text-text-secondary font-geist text-xs uppercase tracking-widest mt-1">
            All scheduled operational tasks have been executed.
          </p>
        </div>
      </div>
    );
  }

  // Case C: No active task, but next task exists
  if (!task && nextTask) {
    return (
      <div className={cn(
        "glass-panel p-5 md:p-12 flex flex-col justify-between relative overflow-hidden border border-border bg-card",
        isTV ? "h-full min-h-[380px]" : "min-h-[240px]",
        className
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-border/20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-t border-l border-border/20 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <span className="px-2.5 py-0.5 bg-warning/15 text-warning text-[9px] md:text-[10px] font-geist font-bold rounded-full uppercase tracking-wider border border-warning/20">
              Pending Stream
            </span>
          </div>
          
          <h2 className="font-geist text-text-muted text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-2">
            Operational Focus
          </h2>
          
          <h3 className={cn(
            "font-geist font-bold text-text-secondary tracking-tight leading-tight mb-4 md:mb-6",
            isTV ? "text-5xl lg:text-6xl" : "text-xl sm:text-2xl md:text-3xl"
          )}>
            Next task starts at {nextTask.start_time}
          </h3>
          
          <p className="text-text-muted text-xs md:text-sm">
            Upcoming task: <strong className="text-text-primary">{nextTask.title}</strong>
          </p>
        </div>
        
        <div className="flex items-center gap-4 pt-4 md:pt-6 border-t border-border/60">
          <div className="flex flex-col">
            <span className="font-geist text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Priority</span>
            <span className="font-geist text-[11px] md:text-xs font-bold text-text-primary uppercase tracking-wide">
              {nextTask.priority}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Case B: Active task exists
  if (task) {
    return (
      <div className={cn(
        "glass-panel p-5 md:p-12 flex flex-col justify-between relative overflow-hidden border border-border bg-card",
        isTV ? "h-full min-h-[380px]" : "min-h-[240px]",
        className
      )}>
        <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-border/20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-t border-l border-border/20 pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <span className="px-2.5 py-0.5 bg-accent/15 text-primary text-[9px] md:text-[10px] font-geist font-bold rounded-full uppercase tracking-wider border border-accent/20">
              Active Now
            </span>
            <span className="text-text-muted font-geist text-[9px] md:text-[10px] tracking-wider uppercase">
              ID: EXEC-00{task.id.slice(0, 4)}
            </span>
          </div>
          
          <h2 className="font-geist text-text-muted text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-2">
            Current Task Focus
          </h2>
          
          <h3 className={cn(
            "font-geist font-bold text-text-primary tracking-tight leading-tight mb-4 md:mb-6",
            isTV ? "text-5xl lg:text-6xl" : "text-xl sm:text-2xl md:text-3xl"
          )}>
            {task.title}
          </h3>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 md:pt-6 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="flex flex-col">
              <span className="font-geist text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Time Period</span>
              <span className="font-geist text-[11px] md:text-xs font-bold text-text-primary uppercase tracking-wide">
                {task.start_time} - {task.end_time || 'ASAP'}
              </span>
            </div>
            
            <div className="w-px h-6 bg-border hidden sm:block" />
            
            <div className="flex flex-col">
              <span className="font-geist text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Priority</span>
              <span className="font-geist text-[11px] md:text-xs font-bold text-text-primary uppercase tracking-wide">
                {task.priority}
              </span>
            </div>

            {countdownText && (
              <>
                <div className="w-px h-6 bg-border hidden sm:block" />
                <div className="flex flex-col">
                  <span className="font-geist text-[9px] md:text-[10px] text-accent uppercase tracking-wider mb-0.5">Countdown</span>
                  <span className="font-geist text-[11px] md:text-xs font-bold text-accent uppercase tracking-wide animate-pulse">
                    {countdownText}
                  </span>
                </div>
              </>
            )}
          </div>
          
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                alert(`Connecting to conference room for: ${task.title}`);
              }
            }}
            className="w-full sm:w-auto px-4 py-2 bg-accent hover:bg-blue-700 text-text-primary font-geist font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-accent/10 active:scale-98 cursor-pointer"
          >
            <Video size={12} />
            JOIN EXECUTIVE ROOM
          </button>
        </div>
      </div>
    );
  }

  // Fallback (should not be reached)
  return null;
}
