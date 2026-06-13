'use client';

import { Task, Meeting } from '@/lib/types';
import { AppHeader } from './AppHeader';
import { RightNowCard } from './RightNowCard';
import { PriorityList } from './PriorityList';
import { MeetingsPanel } from './MeetingsPanel';
import { AlertsPanel } from './AlertsPanel';
import { PendingApprovalsPanel } from './PendingApprovalsPanel';
import { DelegatedPanel } from './DelegatedPanel';
import { DeadlinesPanel } from './DeadlinesPanel';
import { ShieldCheck, Zap } from 'lucide-react';

interface MobileDashboardProps {
  tasks: Task[];
  meetings: Meeting[];
}

export function MobileDashboard({ tasks, meetings }: MobileDashboardProps) {
  const rightNowTask = tasks.find(t => t.isRightNow);
  
  // Sort priorities: urgent (4) > high (3) > medium (2) > low (1)
  const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
  const priorityTasks = tasks
    .filter(t => t.category === 'priority' && !t.isRightNow && t.status !== 'done')
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority])
    .slice(0, 3);
  
  return (
    <div className="min-h-screen bg-background text-text-primary pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Premium Dashboard Header */}
      <AppHeader subtitle="Executive Control Interface" showNavButtons={true} />

      {/* Main Single-Column / Desktop-Fluid Flow */}
      <main className="mt-6 space-y-8">
        
        {/* Section 1: Right Now Active Focus (Full width at top) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-secondary">
              <Zap size={14} className="text-accent" />
              <h2 className="font-geist text-[10px] font-bold uppercase tracking-[0.2em]">Operational Focus</h2>
            </div>
            <span className="font-geist text-[9px] font-bold text-success uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Active Now
            </span>
          </div>
          
          <RightNowCard task={rightNowTask} />
        </section>

        {/* Section 2: Critical Metrics & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Primary Column (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-8">
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
    </div>
  );
}
