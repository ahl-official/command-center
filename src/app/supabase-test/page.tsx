'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, ArrowLeft, RefreshCw, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';

export default function SupabaseTestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [tasksCount, setTasksCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [urlConfigured, setUrlConfigured] = useState<boolean>(false);
  const [keyConfigured, setKeyConfigured] = useState<boolean>(false);

  const testConnection = useCallback(async () => {
    setStatus('loading');
    setErrorMsg(null);
    setTasksCount(null);
    setUrlConfigured(!!process.env.NEXT_PUBLIC_SUPABASE_URL);
    setKeyConfigured(!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');

      if (error) {
        throw error;
      }

      setTasksCount(data ? data.length : 0);
      setStatus('success');
    } catch (err: unknown) {
      console.error('Supabase test connection failed:', err);
      const error = err as Error;
      setErrorMsg(error.message || 'Unknown database query error');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      testConnection();
    }, 0);
    return () => clearTimeout(timer);
  }, [testConnection]);

  return (
    <div className="min-h-screen bg-background text-text-primary flex items-center justify-center p-4">
      <div className="glass-panel bg-card border border-border p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Database className="text-accent" size={24} />
          <div>
            <h1 className="font-geist text-lg font-bold tracking-tight uppercase">
              Supabase Diagnostics
            </h1>
            <p className="font-geist text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
              Phase 1A Connection Audit
            </p>
          </div>
        </div>

        {/* Env Status */}
        <div className="space-y-3">
          <h2 className="font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Environment Configuration
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className={cn(
              "p-3 rounded-lg border text-center text-xs font-semibold font-geist",
              urlConfigured ? "bg-success/5 border-success/20 text-success" : "bg-danger/5 border-danger/20 text-danger"
            )}>
              <span className="block text-[9px] text-text-muted uppercase tracking-wide mb-1">URL Variable</span>
              {urlConfigured ? 'LOADED' : 'MISSING'}
            </div>
            <div className={cn(
              "p-3 rounded-lg border text-center text-xs font-semibold font-geist",
              keyConfigured ? "bg-success/5 border-success/20 text-success" : "bg-danger/5 border-danger/20 text-danger"
            )}>
              <span className="block text-[9px] text-text-muted uppercase tracking-wide mb-1">Anon Key</span>
              {keyConfigured ? 'LOADED' : 'MISSING'}
            </div>
          </div>
        </div>

        {/* Connection Status Card */}
        <div className="space-y-3">
          <h2 className="font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Connection Status
          </h2>
          
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2 p-6 bg-card-elevated border border-border rounded-lg text-xs font-medium text-text-secondary">
              <RefreshCw size={14} className="animate-spin text-accent" />
              <span>Querying database...</span>
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-success/5 border border-success/20 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-success font-semibold text-sm">
                <CheckCircle2 size={16} />
                <span>Connected Successfully</span>
              </div>
              <p className="text-xs text-text-secondary font-inter leading-relaxed">
                Supabase query execution returned successfully. 
              </p>
              <div className="pt-2 border-t border-success/10 flex justify-between text-[11px] font-geist font-bold text-success uppercase">
                <span>Tasks Found:</span>
                <span className="tabular-nums">{tasksCount}</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-danger/5 border border-danger/20 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-danger font-semibold text-sm">
                <ShieldAlert size={16} />
                <span>Connection Failure</span>
              </div>
              <p className="text-[11px] text-text-secondary font-inter leading-relaxed bg-black/40 p-2.5 rounded border border-border/40 font-mono break-all max-h-32 overflow-y-auto">
                {errorMsg}
              </p>
              <p className="text-[10px] text-text-muted font-inter">
                Verify your env parameters in `.env.local` and ensure your Supabase database table `tasks` exists.
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-border flex gap-3">
          <Link 
            href="/dashboard" 
            className="flex-1 px-4 py-2.5 bg-card-elevated hover:bg-background border border-border text-text-secondary hover:text-text-primary rounded-lg text-[10px] font-geist font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <button 
            onClick={testConnection}
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2.5 bg-accent hover:bg-blue-700 text-text-primary rounded-lg text-[10px] font-geist font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accent/15 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={12} className={cn(status === 'loading' && "animate-spin")} /> Re-test
          </button>
        </div>

      </div>
    </div>
  );
}
