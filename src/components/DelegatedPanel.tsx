'use client';

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Users, ChevronRight } from 'lucide-react';

interface DelegatedPanelProps {
  tasks: Task[];
  isTV?: boolean;
}

export function DelegatedPanel({ tasks, isTV }: DelegatedPanelProps) {
  // Filter for delegated tasks and sort active tasks to the top
  const delegatedTasks = tasks
    .filter(t => t.category === 'delegated')
    .sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return 0;
    });

  // Fallback avatars or dynamic initials matching seed data
  const getAvatarUrl = (owner?: string) => {
    if (!owner) return null;
    const name = owner.toLowerCase();
    if (name.includes('marcus')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuBn3qTafV5hpPWYkLujN3g3E9vb-PRRo8yDCiS47e0AlsQUeCPHrf79dkTuHYxffqNbSlGvY5oX-Es4-mErNWat8wvePUk4bGxkOrgZSas4tgvvY0lkOYGpw1NSoEXoqJSER_HdkYE_viL0ZPzZOCDAqgls5GO81cBpqI8OoBDwo2i4lY5Lnr8Kx-lrpxizLXptYb6dpGsf7nNBMrOhgmOIhmNx8rFCxb_rQrEoIzP6AVhAAVy_j97uaVygfc0BKovhEiQfWWiUtg";
    }
    if (name.includes('sarah')) {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuBr3_ci2ttJELmbGJiqFdPOHf-LaPSP1DVjg1XPSTMUSJmYycA-Y7yjToDODQ6GmPCsSzQ43H4SiukzQNBePDXSIwv0ERGldEZ2RRCBdviV2V5eplZDok4rD38SnRJQIddwM6cy1W-LZtD-K7QgMmt1YFP7M94vMFYFk_NIxxyaJ67OXnLxgqUxdHKnoEt0q_THtAMWnILM5W5cZCnOjb8CyK-quvi9mMM0KV-u7E7qeiICvHC6lXNAUMjsRqQjGAgnnAT6sABg1A";
    }
    return null;
  };

  const getInitials = (owner?: string) => {
    if (!owner) return '??';
    return owner
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className={cn(
      "glass-panel bg-card border border-border p-6",
      isTV ? "p-8 flex-grow" : ""
    )}>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Users className="text-accent" size={16} />
          <h3 className="font-geist text-xs font-bold text-text-muted uppercase tracking-[0.2em]">
            Delegated Flow
          </h3>
        </div>
        <span className="font-geist text-[10px] font-bold text-accent uppercase tracking-widest">
          {delegatedTasks.filter(t => t.status !== 'done').length} Active
        </span>
      </div>

      <div className="space-y-4">
        {delegatedTasks.length === 0 ? (
          <p className="text-text-muted text-xs italic font-medium">No delegated tasks active.</p>
        ) : (
          delegatedTasks.map(task => {
            const avatarUrl = getAvatarUrl(task.owner);
            return (
              <div 
                key={task.id} 
                className="bg-background/40 rounded-lg p-3 border border-border/30 flex items-center justify-between group transition-all hover:border-border/80 hover:bg-background/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {avatarUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border flex-shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={avatarUrl} 
                        alt={task.owner || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-card-elevated border border-border flex items-center justify-center text-[10px] font-geist font-bold text-text-secondary flex-shrink-0">
                      {getInitials(task.owner)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="font-geist text-xs font-bold text-text-primary truncate">
                      {task.owner || 'Unassigned'}
                    </h4>
                    <p className="font-inter text-[11px] text-text-secondary truncate mt-0.5 max-w-[150px] sm:max-w-[250px]">
                      {task.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-geist text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                    task.status === 'done' 
                      ? 'bg-success/10 text-success border border-success/20'
                      : task.status === 'in-progress'
                      ? 'bg-accent/15 text-primary border border-accent/20'
                      : 'bg-zinc-800 text-text-muted border border-border/20'
                  )}>
                    {task.status}
                  </span>
                  <ChevronRight size={14} className="text-text-muted/40 group-hover:text-text-secondary transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
