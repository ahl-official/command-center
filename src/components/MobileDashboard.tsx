'use client';

import { useState, useEffect } from 'react';
import { Task, Meeting, Priority } from '@/lib/types';
import { SupabaseTask } from '@/lib/supabase/types';
import { AppHeader } from './AppHeader';
import { RightNowCard } from './RightNowCard';
import { PriorityList } from './PriorityList';
import { MeetingsPanel } from './MeetingsPanel';
import { AlertsPanel } from './AlertsPanel';
import { PendingApprovalsPanel } from './PendingApprovalsPanel';
import { DelegatedPanel } from './DelegatedPanel';
import { DeadlinesPanel } from './DeadlinesPanel';
import { PriorityBadge } from './PriorityBadge';
import { ShieldCheck, Zap, Calendar, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DayOverview } from './DayOverview';

interface MobileDashboardProps {
  tasks: Task[];
  meetings: Meeting[];
  supabaseTasks?: SupabaseTask[];
}

export function MobileDashboard({ tasks, meetings, supabaseTasks = [] }: MobileDashboardProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isOverviewMode, setIsOverviewMode] = useState(false);

  // Setup tick timer on client side to avoid SSR/hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 0);
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Overview Cycle Effect (Every 20 minutes, show for 15 seconds)
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsOverviewMode(true);
      
      const timer = setTimeout(() => {
        setIsOverviewMode(false);
      }, 15000);
      
      return () => clearTimeout(timer);
    }, 20 * 60 * 1000);

    return () => {
      clearInterval(cycleInterval);
    };
  }, []);

  // Support query param preview: ?overview=1
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('overview=1')) {
      const startTimer = setTimeout(() => {
        setIsOverviewMode(true);
      }, 0);
      const timer = setTimeout(() => {
        setIsOverviewMode(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 15000);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(timer);
      };
    }
  }, []);

  const parseTimeToSeconds = (timeStr: string | null) => {
    if (!timeStr) return null;
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts.length > 2 ? parseInt(parts[2], 10) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Derive all active state variables if client is mounted and currentTime is set
  let activeTask: SupabaseTask | null = null;
  let nextTask: SupabaseTask | null = null;
  let isDayComplete = false;
  let countdownText = '';
  let progress = 0;
  let next3Tasks: SupabaseTask[] = [];
  let max3PendingTasks: SupabaseTask[] = [];

  if (currentTime && supabaseTasks.length > 0) {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentSecond = currentTime.getSeconds();
    const currentTotalSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;

    // Determine active task
    activeTask = supabaseTasks.find(task => {
      if (!task.start_time) return false;
      const start = parseTimeToSeconds(task.start_time);
      if (start === null) return false;
      const duration = task.end_time ? (parseTimeToSeconds(task.end_time)! - start) : 3600;
      const end = start + duration;
      return currentTotalSeconds >= start && currentTotalSeconds < end;
    }) || null;

    // Determine all future tasks
    const futureTasks = supabaseTasks.filter(task => {
      if (!task.start_time) return false;
      const start = parseTimeToSeconds(task.start_time);
      return start !== null && start > currentTotalSeconds;
    });
    nextTask = futureTasks[0] || null;
    next3Tasks = futureTasks.slice(0, 3);

    // Determine pending tasks
    const pendingTasks = supabaseTasks.filter(task => {
      if (task.status !== 'pending') return false;
      if (task.start_time) {
        const start = parseTimeToSeconds(task.start_time);
        if (start !== null) {
          const duration = task.end_time ? (parseTimeToSeconds(task.end_time)! - start) : 3600;
          const end = start + duration;
          if (currentTotalSeconds >= end) return false; // past
        }
      }
      return true;
    });

    // Sort pending tasks by nearest start_time first (nulls last)
    const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
      if (!a.start_time) return 1;
      if (!b.start_time) return -1;
      return a.start_time.localeCompare(b.start_time);
    });
    max3PendingTasks = sortedPendingTasks.slice(0, 3);

    // Check if day is complete
    isDayComplete = !activeTask && supabaseTasks.every(task => {
      if (!task.start_time) return true;
      const start = parseTimeToSeconds(task.start_time)!;
      const duration = task.end_time ? (parseTimeToSeconds(task.end_time)! - start) : 3600;
      const end = start + duration;
      return currentTotalSeconds >= end;
    });

    // Compute countdown text
    if (activeTask && activeTask.start_time) {
      const start = parseTimeToSeconds(activeTask.start_time)!;
      const duration = activeTask.end_time ? (parseTimeToSeconds(activeTask.end_time)! - start) : 3600;
      const end = start + duration;
      const remainingSeconds = end - currentTotalSeconds;

      if (remainingSeconds > 0) {
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        if (remainingMinutes >= 60) {
          const hours = Math.floor(remainingMinutes / 60);
          const minutes = remainingMinutes % 60;
          countdownText = minutes === 0 
            ? `${hours} hour${hours > 1 ? 's' : ''} remaining`
            : `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''} remaining`;
        } else {
          countdownText = `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} remaining`;
        }
      } else {
        countdownText = '0 minutes remaining';
      }
    }

    // Compute progress %
    const completedCount = supabaseTasks.filter(task => {
      if (task.status === 'done') return true;
      if (!task.start_time) return false;
      const start = parseTimeToSeconds(task.start_time);
      if (start === null) return false;
      const duration = task.end_time ? (parseTimeToSeconds(task.end_time)! - start) : 3600;
      const end = start + duration;
      return currentTotalSeconds >= end;
    }).length;

    progress = Math.round((completedCount / supabaseTasks.length) * 100);
  }

  // Helper for timeline display status
  const getTaskDisplayStatus = (task: SupabaseTask) => {
    if (!currentTime) return 'future';
    if (activeTask && activeTask.id === task.id) return 'active';
    if (task.status === 'done') return 'completed';
    if (!task.start_time) return 'future';

    const currentTotalSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
    const start = parseTimeToSeconds(task.start_time)!;
    const duration = task.end_time ? (parseTimeToSeconds(task.end_time)! - start) : 3600;
    const end = start + duration;

    if (currentTotalSeconds >= end) return 'completed';
    return 'future';
  };

  // Local storage priority tasks
  const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
  const priorityTasks = tasks
    .filter(t => t.category === 'priority' && t.status !== 'done')
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
    .slice(0, 3);

  // Reusable Timeline Render function
  const renderTimeline = () => (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-text-secondary">
          <Calendar size={14} className="text-accent" />
          <h2 className="font-geist text-[10px] font-bold uppercase tracking-[0.2em]">Operational Timeline</h2>
        </div>
        <span className="font-geist text-[9px] text-text-muted uppercase tracking-wider">
          Today&apos;s Schedule
        </span>
      </div>
      
      <div className="space-y-3">
        {supabaseTasks.map(task => {
          const status = getTaskDisplayStatus(task);
          
          return (
            <div 
              key={task.id}
              className={cn(
                "glass-panel p-4 border rounded-xl flex items-center justify-between gap-4 transition-all",
                status === 'active' && "border-accent bg-accent/5 shadow-md shadow-accent/5 ring-1 ring-accent/30",
                status === 'completed' && "border-success/30 bg-success/2 opacity-75",
                status === 'future' && "border-border/60 hover:border-border"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn(
                  "flex-shrink-0 text-center w-16 bg-background/50 border rounded-lg p-1.5 flex flex-col justify-center",
                  status === 'active' && "border-accent/30",
                  status === 'completed' && "border-success/20"
                )}>
                  <span className={cn(
                    "font-geist text-[10px] font-bold block tabular-nums",
                    status === 'active' && "text-accent",
                    status === 'completed' && "text-success",
                    status === 'future' && "text-text-primary"
                  )}>
                    {task.start_time || 'ASAP'}
                  </span>
                  {task.end_time && (
                    <span className="text-[8px] font-semibold text-text-muted mt-0.5 border-t border-border/30 pt-0.5 tabular-nums">
                      {task.end_time}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className={cn(
                    "font-geist font-bold text-xs text-text-primary truncate",
                    status === 'completed' && "text-text-muted line-through"
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <PriorityBadge priority={task.priority as Priority} />
                    <span className={cn(
                      "text-[8px] font-geist font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                      status === 'active' && "bg-accent/10 text-accent border-accent/20",
                      status === 'completed' && "bg-success/10 text-success border-success/20",
                      status === 'future' && "bg-card-elevated text-text-muted border-border/40"
                    )}>
                      {status === 'active' ? 'Active Now' : status === 'completed' ? 'Completed' : 'Upcoming'}
                    </span>
                  </div>
                </div>
              </div>

              {status === 'active' && (
                <span className="font-geist text-[10px] font-bold text-accent animate-pulse uppercase tracking-wider flex-shrink-0">
                  Live
                </span>
              )}
              {status === 'completed' && (
                <Check size={14} className="text-success flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // Reusable Next Tasks Render function
  const renderNextTasks = () => (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-text-secondary">
        <Clock size={14} className="text-accent" />
        <h2 className="font-geist text-[10px] font-bold uppercase tracking-[0.2em]">Next Tasks</h2>
      </div>
      <div className="space-y-3">
        {next3Tasks.length === 0 ? (
          <div className="glass-panel p-6 text-center border border-dashed border-border bg-card/50 text-text-muted text-xs italic rounded-xl">
            No upcoming tasks.
          </div>
        ) : (
          next3Tasks.map(task => (
            <div key={task.id} className="glass-panel p-4 border border-border bg-card flex items-center justify-between gap-4 rounded-xl">
              <div className="min-w-0">
                <h4 className="font-geist font-bold text-xs text-text-primary truncate">
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <PriorityBadge priority={task.priority as Priority} />
                  <span className="text-[9px] font-geist font-bold text-text-muted">
                    {task.start_time} - {task.end_time || 'ASAP'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  // Reusable Pending Tasks Render function
  const renderPendingTasks = () => (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-text-secondary">
        <ShieldCheck size={14} className="text-accent" />
        <h2 className="font-geist text-[10px] font-bold uppercase tracking-[0.2em]">Pending Tasks</h2>
      </div>
      <div className="space-y-3">
        {max3PendingTasks.length === 0 ? (
          <div className="glass-panel p-6 text-center border border-dashed border-border bg-card/50 text-text-muted text-xs italic rounded-xl">
            No pending tasks.
          </div>
        ) : (
          max3PendingTasks.map(task => (
            <div key={task.id} className="glass-panel p-4 border border-border bg-card flex items-center justify-between gap-4 rounded-xl">
              <div className="min-w-0">
                <h4 className="font-geist font-bold text-xs text-text-primary truncate">
                  {task.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <PriorityBadge priority={task.priority as Priority} />
                  <span className="text-[9px] font-geist font-bold text-text-muted">
                    {task.start_time || 'ASAP'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );

  if (isOverviewMode && currentTime) {
    return (
      <DayOverview 
        supabaseTasks={supabaseTasks}
        progress={progress}
        currentTime={currentTime}
        onClose={() => setIsOverviewMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Premium Dashboard Header */}
      <AppHeader subtitle="Executive Control Interface" showNavButtons={true} />

      {/* Day Progress Bar */}
      {currentTime && supabaseTasks.length > 0 && (
        <div className="glass-panel p-3.5 border border-border bg-card mb-6 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-geist text-[10px] font-bold text-text-secondary uppercase tracking-[0.15em]">
              Daily Schedule Progress
            </span>
            <span className="font-geist text-xs font-bold text-accent">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5 overflow-hidden border border-border/50">
            <div 
              className="bg-accent h-1.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Single-Column / Desktop-Fluid Flow */}
      <main className="mt-6 space-y-8">
        
        {/* Section 1: Right Now Active Focus / Supabase Current Task */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-secondary">
              <Zap size={14} className="text-accent" />
              <h2 className="font-geist text-[10px] font-bold uppercase tracking-[0.2em]">Operational Focus</h2>
            </div>
            {currentTime && activeTask && (
              <span className="font-geist text-[9px] font-bold text-success uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                Active Now
              </span>
            )}
          </div>
          
          <RightNowCard 
            task={activeTask} 
            nextTask={nextTask} 
            isDayComplete={isDayComplete} 
            countdownText={countdownText} 
            supabaseTasksCount={supabaseTasks.length}
          />
        </section>

        {/* MOBILE LAYOUT ONLY (lg:hidden) */}
        {currentTime && supabaseTasks.length > 0 && (
          <div className="flex flex-col space-y-8 lg:hidden">
            {/* 2. Next Tasks */}
            {renderNextTasks()}

            {/* 3. Timeline */}
            {renderTimeline()}

            {/* 4. Pending Tasks */}
            {renderPendingTasks()}

            {/* Other Mobile Panels */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <ShieldCheck size={14} className="text-accent" />
                <h2 className="font-geist text-[10px] font-bold uppercase tracking-[0.2em]">Top Priorities</h2>
              </div>
              <PriorityList tasks={priorityTasks} />
            </section>
            <PendingApprovalsPanel tasks={tasks} />
            <DeadlinesPanel tasks={tasks} />
            <AlertsPanel tasks={tasks} />
            <MeetingsPanel meetings={meetings} />
            <DelegatedPanel tasks={tasks} />
          </div>
        )}

        {/* DESKTOP LAYOUT ONLY (hidden lg:grid) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          
          {/* Left / Primary Column (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 3. Timeline (Bottom Left) */}
            {currentTime && supabaseTasks.length > 0 && renderTimeline()}

            {/* Top Priorities */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <ShieldCheck size={14} className="text-accent" />
                <h2 className="font-geist text-[10px] font-bold uppercase tracking-[0.2em]">Top Priorities</h2>
              </div>
              <PriorityList tasks={priorityTasks} />
            </section>

            {/* Approvals */}
            <section>
              <PendingApprovalsPanel tasks={tasks} />
            </section>

            {/* Deadlines */}
            <section>
              <DeadlinesPanel tasks={tasks} />
            </section>
          </div>

          {/* Right / Ancillary Column (5 cols on Desktop) */}
          <div className="lg:col-span-5 space-y-8">
            {/* 2. Next Tasks (Right side) */}
            {currentTime && supabaseTasks.length > 0 && renderNextTasks()}

            {/* 4. Pending Tasks (Bottom Right) */}
            {currentTime && supabaseTasks.length > 0 && renderPendingTasks()}

            {/* Urgent Alerts */}
            <section>
              <AlertsPanel tasks={tasks} />
            </section>

            {/* Meetings Panel */}
            <section>
              <MeetingsPanel meetings={meetings} />
            </section>

            {/* Delegated Panel */}
            <section>
              <DelegatedPanel tasks={tasks} />
            </section>
          </div>

        </div>
      </main>
      {/* Dev Mode Preview Trigger */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50">
          <button
            onClick={() => {
              setIsOverviewMode(true);
              const timer = setTimeout(() => {
                setIsOverviewMode(false);
              }, 15000);
              return () => clearTimeout(timer);
            }}
            className="px-3 py-1.5 bg-card hover:bg-card-elevated border border-border text-[9px] font-geist font-bold uppercase tracking-wider text-text-secondary hover:text-text-primary rounded-lg transition-colors cursor-pointer shadow-lg shadow-black/40"
          >
            Preview Overview (15s)
          </button>
        </div>
      )}
    </div>
  );
}
