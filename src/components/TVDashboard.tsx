'use client';

import { useState, useEffect } from 'react';
import { Task, Meeting } from '@/lib/types';
import { RightNowCard } from './RightNowCard';
import { PriorityList } from './PriorityList';
import { PendingApprovalsPanel } from './PendingApprovalsPanel';
import { DelegatedPanel } from './DelegatedPanel';
import { DeadlinesPanel } from './DeadlinesPanel';
import { AlertsPanel } from './AlertsPanel';
import { Calendar, Bell, Settings, Maximize, Minimize } from 'lucide-react';
import Link from 'next/link';

interface TVDashboardProps {
  tasks: Task[];
  meetings: Meeting[];
}

export function TVDashboard({ tasks, meetings }: TVDashboardProps) {
  const [time, setTime] = useState<Date | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const initTime = () => setTime(new Date());
    initTime();
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update last-updated timestamp when tasks/meetings change
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('en-GB', { hour12: false }));
    }, 0);
    return () => clearTimeout(timer);
  }, [tasks, meetings]);

  // Monitor fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '00:00:00';
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Loading...';
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const rightNowTask = tasks.find(t => t.isRightNow);
  
  // Sort priorities: urgent (4) > high (3) > medium (2) > low (1)
  const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
  const priorityTasks = tasks
    .filter(t => t.category === 'priority' && !t.isRightNow && t.status !== 'done')
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
    .slice(0, 3);
  
  // Find Next Meeting
  const sortedMeetings = [...meetings].sort((a, b) => a.time.localeCompare(b.time));
  const nextMeeting = sortedMeetings.find(m => m.status === 'upcoming' || m.status === 'ongoing');

  return (
    <div className="h-screen bg-background text-text-primary p-12 overflow-hidden flex flex-col font-sans select-none">
      {/* Top AppBar - Derived from code.html */}
      <header className="flex justify-between items-end mb-10 pb-8 border-b border-border">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <h1 className="font-geist text-5xl font-extrabold tracking-tighter text-text-primary uppercase">
              COMMAND CENTER
            </h1>
            <div className="flex gap-2">
              <Link 
                href="/dashboard" 
                className="px-3 py-1.5 bg-card hover:bg-card-elevated border border-border text-text-secondary hover:text-text-primary rounded text-xs font-geist font-bold uppercase tracking-wider transition-colors"
              >
                Exit Fullscreen
              </Link>
              <button 
                onClick={toggleFullscreen}
                className="px-3 py-1.5 bg-card hover:bg-card-elevated border border-border text-text-secondary hover:text-text-primary rounded text-xs font-geist font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer"
              >
                {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
                {isFullscreen ? 'Exit TV Fullscreen' : 'Enter TV Fullscreen'}
              </button>
            </div>
          </div>
          <p className="font-geist text-sm text-text-secondary tracking-[0.2em] uppercase mt-2">
            Today&apos;s execution view
          </p>
        </div>

        <div className="flex items-center gap-10 text-right">
          <div className="flex flex-col items-end">
            <span className="font-geist text-5xl font-bold text-accent tabular-nums text-glow">
              {formatTime(time)}
            </span>
            <span className="font-geist text-xs text-text-muted uppercase tracking-wider mt-1">
              {formatDate(time)}
            </span>
          </div>
          <div className="flex gap-4 text-text-secondary">
            <Bell size={28} className="hover:text-accent cursor-pointer transition-colors" />
            <Settings size={28} className="hover:text-accent cursor-pointer transition-colors" />
          </div>
        </div>
      </header>

      {/* Main Content Area: 16:9 Dashboard Grid */}
      <main className="flex-grow grid grid-cols-12 gap-8 overflow-hidden items-stretch">
        
        {/* Left Column: Primary Hero (Large Focus Card) */}
        <section className="col-span-8 flex flex-col">
          <RightNowCard task={rightNowTask} isTV className="flex-grow h-full" />
        </section>

        {/* Right Column: Secondary Metrics */}
        <section className="col-span-4 flex flex-col gap-8">
          {/* Next Meeting Card */}
          <div className="glass-panel p-6 flex flex-col justify-between bg-card border border-border h-36">
            <div className="flex justify-between items-center">
              <span className="font-geist text-xs font-bold text-text-muted uppercase tracking-wider">Next Meeting</span>
              <span className="text-accent font-geist text-sm font-bold tabular-nums">
                {nextMeeting ? nextMeeting.time : 'No meetings'}
              </span>
            </div>
            
            {nextMeeting ? (
              <div className="flex items-start gap-4">
                <div className="bg-card-elevated p-2 rounded-lg border border-border flex items-center justify-center">
                  <Calendar className="text-accent" size={24} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-geist text-base font-bold text-text-primary truncate">{nextMeeting.title}</h4>
                  <p className="font-inter text-xs text-text-secondary truncate mt-0.5">{nextMeeting.person} • {nextMeeting.mode}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-text-muted text-xs italic">
                No upcoming engagements scheduled.
              </div>
            )}
          </div>

          {/* Urgent Alerts List */}
          <div className="flex-grow">
            <AlertsPanel tasks={tasks} isTV />
          </div>
        </section>

        {/* Bottom Row: Data Grid (4 Columns) */}
        <div className="col-span-12 grid grid-cols-4 gap-8 mt-4">
          
          {/* Top Priorities */}
          <div className="glass-panel p-6 bg-card border border-border flex flex-col justify-between h-[300px]">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border/60">
              <h5 className="font-geist text-xs font-bold text-text-muted uppercase tracking-[0.15em]">Top Priorities</h5>
              <span className="material-symbols-outlined text-text-muted text-lg" data-icon="grid_view">grid_view</span>
            </div>
            <div className="flex-grow overflow-hidden">
              <PriorityList tasks={priorityTasks} isTV />
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="h-[300px] overflow-hidden">
            <PendingApprovalsPanel tasks={tasks} isTV />
          </div>

          {/* Delegated Tasks */}
          <div className="h-[300px] overflow-hidden">
            <DelegatedPanel tasks={tasks} isTV />
          </div>

          {/* Approaching Deadlines */}
          <div className="h-[300px] overflow-hidden">
            <DeadlinesPanel tasks={tasks} isTV />
          </div>

        </div>
      </main>

      {/* Footer Readouts */}
      <footer className="mt-8 pt-4 border-t border-border/40 flex justify-between items-center text-text-muted font-geist font-bold uppercase tracking-widest text-[10px]">
        <div className="flex gap-6 items-center">
          <span>Live Operations Console</span>
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          <span>Security Grid Active</span>
          <span>•</span>
          <span>TV Optimized</span>
          {lastUpdated && (
            <>
              <span>•</span>
              <span className="text-accent font-semibold">Last Synced: {lastUpdated}</span>
            </>
          )}
        </div>
        <div>
          Auto-refresh active (30s)
        </div>
      </footer>
    </div>
  );
}
