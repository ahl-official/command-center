'use client';

import { Meeting } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Video, Users, MapPin, CalendarClock } from 'lucide-react';

interface MeetingsPanelProps {
  meetings: Meeting[];
  isTV?: boolean;
}

export function MeetingsPanel({ meetings, isTV }: MeetingsPanelProps) {
  const modeIcons = {
    call: <Video size={14} className="text-accent" />,
    online: <Video size={14} className="text-accent" />,
    meeting: <Users size={14} className="text-accent" />,
    'in-person': <MapPin size={14} className="text-accent" />,
  };

  const getModeIcon = (mode: string) => {
    return modeIcons[mode as keyof typeof modeIcons] || <Users size={14} className="text-accent" />;
  };

  // Sort meetings by time ascending
  const sortedMeetings = [...meetings].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className={cn(
      "glass-panel bg-card border border-border p-6",
      isTV ? "p-8 flex-grow" : ""
    )}>
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <CalendarClock className="text-accent" size={16} />
          <h3 className="font-geist text-xs font-bold text-text-muted uppercase tracking-[0.2em]">
            Executive Engagements
          </h3>
        </div>
        <span className="font-geist text-[10px] font-bold text-accent uppercase tracking-widest">
          {sortedMeetings.filter(m => m.status === 'upcoming' || m.status === 'ongoing').length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {sortedMeetings.length === 0 ? (
          <p className="text-text-muted text-xs italic font-medium">No engagements scheduled today.</p>
        ) : (
          sortedMeetings.map(meeting => (
            <div 
              key={meeting.id} 
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg border transition-all bg-background/40",
                meeting.status === 'ongoing' 
                  ? "border-accent/40 bg-accent/5" 
                  : "border-border/30 hover:border-border/80"
              )}
            >
              <div className="flex-shrink-0 text-center w-14">
                <span className="font-geist text-sm font-bold text-text-primary block tabular-nums">
                  {meeting.time}
                </span>
                <span className="text-text-muted font-geist text-[8px] font-bold uppercase tracking-wide">
                  {meeting.status === 'ongoing' ? 'NOW' : 'TIME'}
                </span>
              </div>

              <div className="w-px h-8 bg-border" />

              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h4 className="font-geist text-xs font-bold text-text-primary truncate">
                    {meeting.title}
                  </h4>
                  <span className={cn(
                    "font-geist text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                    meeting.status === 'completed' 
                      ? 'bg-zinc-800/80 text-text-muted border border-border/20' 
                      : meeting.status === 'ongoing'
                      ? 'bg-success/15 text-success border border-success/20 animate-pulse'
                      : 'bg-accent/15 text-primary border border-accent/20'
                  )}>
                    {meeting.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-text-secondary font-inter text-[10px] font-medium">
                  <div className="flex items-center gap-1">
                    {getModeIcon(meeting.mode)}
                    <span className="truncate">{meeting.person}</span>
                  </div>
                  <span className="text-text-muted/50">•</span>
                  <span className="uppercase text-[9px] font-semibold text-text-muted">{meeting.mode}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
