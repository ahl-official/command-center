'use client';

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Video } from 'lucide-react';

interface RightNowCardProps {
  task?: Task;
  className?: string;
  isTV?: boolean;
}

export function RightNowCard({ task, className, isTV }: RightNowCardProps) {
  if (!task) {
    return (
      <div className={cn(
        "glass-panel p-6 md:p-10 flex flex-col items-center justify-center text-center",
        isTV ? "h-full min-h-[380px]" : "min-h-[200px]",
        className
      )}>
        <span className="material-symbols-outlined text-text-muted text-4xl md:text-5xl mb-4" data-icon="terminal">terminal</span>
        <p className={cn("text-text-secondary font-geist font-bold uppercase tracking-widest", isTV ? "text-2xl" : "text-xs md:text-sm")}>
          No active focus
        </p>
        <p className={cn("text-text-muted mt-2 max-w-sm", isTV ? "text-lg" : "text-[11px] md:text-xs")}>
          Select a &quot;Right Now&quot; focus task in the Admin Management panel to deploy.
        </p>
      </div>
    );
  }

  // Calculate status color
  const statusColor = task.status === 'done' ? '#22C55E' : task.status === 'pending' ? '#F59E0B' : '#2563EB';

  return (
    <div className={cn(
      "glass-panel p-5 md:p-12 flex flex-col justify-between relative overflow-hidden border border-border bg-card",
      isTV ? "h-full min-h-[380px]" : "min-h-[240px]",
      className
    )}>
      {/* Decorative subtle structural lines representing technical dashboard grid */}
      <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-border/20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-t border-l border-border/20 pointer-events-none" />
      
      <div>
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <span className="px-2.5 py-0.5 bg-accent/15 text-primary text-[9px] md:text-[10px] font-geist font-bold rounded-full uppercase tracking-wider border border-accent/20">
            Active Stream
          </span>
          <span className="text-text-muted font-geist text-[9px] md:text-[10px] tracking-wider uppercase">
            ID: EXEC-00{task.id}
          </span>
        </div>
        
        <h2 className="font-geist text-text-muted text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-2">
          Right Now Focus
        </h2>
        
        <h3 className={cn(
          "font-geist font-bold text-text-primary tracking-tight leading-tight mb-4 md:mb-6",
          isTV ? "text-5xl lg:text-6xl" : "text-xl sm:text-2xl md:text-3xl"
        )}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className={cn(
            "text-text-secondary font-inter font-normal leading-relaxed max-w-4xl",
            isTV ? "text-xl mb-8" : "text-xs md:text-sm mb-5"
          )}>
            {task.description}
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 md:pt-6 border-t border-border/60">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <div className="flex flex-col">
            <span className="font-geist text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Status</span>
            <div className="flex items-center gap-1.5">
              <span 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: statusColor }}
              />
              <span className="font-geist text-[11px] md:text-xs font-bold text-text-primary uppercase tracking-wide">
                {task.status.replace('-', ' ')}
              </span>
            </div>
          </div>
          
          <div className="w-px h-6 bg-border hidden sm:block" />
          
          <div className="flex flex-col">
            <span className="font-geist text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Execution Target</span>
            <div className="flex items-center gap-1.5 text-text-primary">
              <Clock size={12} className="text-accent" />
              <span className="font-geist text-[11px] md:text-xs font-bold tabular-nums">
                {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : '• ASAP'}
              </span>
            </div>
          </div>
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
