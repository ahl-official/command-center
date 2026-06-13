'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AppHeaderProps {
  subtitle?: string;
  showNavButtons?: boolean;
  actionButtons?: React.ReactNode;
}

export function AppHeader({ 
  subtitle = "Today's execution view", 
  showNavButtons = true,
  actionButtons
}: AppHeaderProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const initTime = () => setTime(new Date());
    initTime();
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
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

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 pb-6 border-b border-border gap-4 md:gap-6">
      <div className="flex flex-col w-full md:w-auto">
        <Link href="/dashboard" className="group">
          <h1 className="font-geist text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-text-primary uppercase group-hover:text-accent transition-colors">
            COMMAND CENTER
          </h1>
        </Link>
        <p className="font-geist text-[10px] sm:text-xs text-text-secondary tracking-[0.2em] uppercase mt-1">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8 w-full md:w-auto">
        {showNavButtons && (
          <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-3 w-full md:w-auto">
            <Link 
              href="/dashboard" 
              className="px-3 py-2 bg-card hover:bg-card-elevated border border-border text-text-secondary hover:text-text-primary rounded-lg text-[10px] md:text-xs font-geist font-semibold uppercase tracking-wider text-center transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/planner" 
              className="px-3 py-2 bg-card hover:bg-card-elevated border border-border text-text-secondary hover:text-text-primary rounded-lg text-[10px] md:text-xs font-geist font-semibold uppercase tracking-wider text-center transition-colors"
            >
              Planner
            </Link>
            <Link 
              href="/admin" 
              className="px-3 py-2 bg-card hover:bg-card-elevated border border-border text-text-secondary hover:text-text-primary rounded-lg text-[10px] md:text-xs font-geist font-semibold uppercase tracking-wider text-center transition-colors"
            >
              Admin
            </Link>
            <Link 
              href="/tv" 
              className="px-3 py-2 bg-accent hover:bg-blue-700 text-text-primary rounded-lg text-[10px] md:text-xs font-geist font-semibold uppercase tracking-wider text-center transition-all shadow-md shadow-accent/20"
            >
              TV Dashboard
            </Link>
          </div>
        )}
        
        {actionButtons && (
          <div className="flex items-center gap-2 w-full md:w-auto justify-stretch md:justify-end">
            {actionButtons}
          </div>
        )}

        <div className="flex items-center justify-between md:flex-col md:items-end w-full md:w-auto border-t md:border-t-0 border-border/40 pt-4 md:pt-0 mt-2 md:mt-0 min-w-0 md:min-w-[180px]">
          <span className="font-geist text-[10px] text-text-muted uppercase tracking-wider md:hidden">System Clock</span>
          <div className="flex flex-col items-end">
            <span className="font-geist text-2xl md:text-3xl font-bold text-accent tabular-nums text-glow">
              {formatTime(time)}
            </span>
            <span className="font-geist text-[9px] md:text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
              {formatDate(time)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
