'use client';

import { Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { FileCheck } from 'lucide-react';

interface PendingApprovalsPanelProps {
  tasks: Task[];
  isTV?: boolean;
}

export function PendingApprovalsPanel({ tasks, isTV }: PendingApprovalsPanelProps) {
  const approvalTasks = tasks.filter(t => t.category === 'approval' && t.status !== 'done');

  // We can group them by owner/team or just list them.
  // In addition, let's show an executive dashboard progress readout like in the design.
  const totalApprovals = approvalTasks.length;

  return (
    <div className={cn(
      "glass-panel bg-card border border-border p-6",
      isTV ? "p-8 flex-grow" : ""
    )}>
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <FileCheck className="text-accent" size={16} />
          <h3 className="font-geist text-xs font-bold text-text-muted uppercase tracking-[0.2em]">
            Pending Approvals
          </h3>
        </div>
        <span className="font-geist text-[10px] font-bold bg-accent/15 text-primary px-2.5 py-0.5 rounded border border-accent/20">
          {totalApprovals < 10 ? `0${totalApprovals}` : totalApprovals} Pending
        </span>
      </div>

      {approvalTasks.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-text-muted text-xs italic">All approvals cleared.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* List approvals */}
          <div className="space-y-3">
            {approvalTasks.map(task => (
              <div 
                key={task.id} 
                className="p-3 bg-background/40 border border-border/30 rounded-lg hover:border-border/80 transition-all"
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h4 className="font-geist text-xs font-bold text-text-primary leading-snug">
                    {task.title}
                  </h4>
                  <span className="font-geist text-[8px] font-bold text-accent uppercase tracking-wider bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded">
                    Review
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-[9px] font-geist font-bold uppercase tracking-wider text-text-secondary">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  <span>Lead: {task.owner || 'Unassigned'}</span>
                  <span className="text-text-muted/50">•</span>
                  <span className="text-text-muted tabular-nums">Due: {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bars for Approvals Type (visual polish matching code.html design) */}
          <div className="pt-4 border-t border-border/40 space-y-3">
            <div>
              <div className="flex justify-between text-[11px] font-geist font-semibold text-text-secondary mb-1">
                <span>Strategic Documents</span>
                <span className="font-bold text-accent">
                  {approvalTasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length}
                </span>
              </div>
              <div className="w-full bg-card-elevated h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-accent h-1 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${totalApprovals > 0 ? (approvalTasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length / totalApprovals) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-[11px] font-geist font-semibold text-text-secondary mb-1">
                <span>Routine Reviews</span>
                <span className="font-bold text-accent">
                  {approvalTasks.filter(t => t.priority !== 'urgent' && t.priority !== 'high').length}
                </span>
              </div>
              <div className="w-full bg-card-elevated h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-accent/60 h-1 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${totalApprovals > 0 ? (approvalTasks.filter(t => t.priority !== 'urgent' && t.priority !== 'high').length / totalApprovals) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
