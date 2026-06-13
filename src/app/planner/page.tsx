'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { SupabaseTask } from '@/lib/supabase/types';
import { Priority, Status } from '@/lib/types';
import { AppHeader } from '@/components/AppHeader';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Calendar, Clock, Plus, Trash2, Edit2, X, Check, CalendarDays, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<SupabaseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [editingTask, setEditingTask] = useState<SupabaseTask | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('pending');

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  };

  const loadTasks = useCallback(async (targetDate: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('date', targetDate)
        .order('start_time', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showFeedback('error', 'Failed to retrieve tasks from database.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => {
      loadTasks(selectedDate);
    }, 0);
    return () => clearTimeout(timer);
  }, [mounted, selectedDate, loadTasks]);

  // Reset form helper
  const resetForm = useCallback((targetDate: string) => {
    setTitle('');
    setDate(targetDate);
    setStartTime('');
    setEndTime('');
    setPriority('medium');
    setStatus('pending');
    setEditingTask(null);
  }, []);

  // Sync selectedDate with form date state is now handled directly in the onChange event of the date picker.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      showFeedback('error', 'Title and Date are required fields.');
      return;
    }

    const taskPayload = {
      title,
      date,
      start_time: startTime || null,
      end_time: endTime || null,
      priority,
      status,
      is_published: false,
      updated_at: new Date().toISOString()
    };

    try {
      if (editingTask) {
        // Update mode
        const { error } = await supabase
          .from('tasks')
          .update(taskPayload)
          .eq('id', editingTask.id);

        if (error) throw error;
        showFeedback('success', 'Task updated successfully.');
      } else {
        // Insert mode
        const { error } = await supabase
          .from('tasks')
          .insert([{
            ...taskPayload,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        showFeedback('success', 'Task deployed to planner.');
      }

      resetForm(selectedDate);
      loadTasks(selectedDate);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to submit task:', error);
      showFeedback('error', error.message || 'Database transaction failed.');
    }
  };

  const handleEditInit = (task: SupabaseTask) => {
    setEditingTask(task);
    setTitle(task.title);
    setDate(task.date);
    setStartTime(task.start_time || '');
    setEndTime(task.end_time || '');
    setPriority(task.priority as Priority);
    setStatus(task.status as Status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showFeedback('success', 'Task removed from database.');
      loadTasks(selectedDate);
    } catch (err) {
      console.error('Failed to delete task:', err);
      showFeedback('error', 'Failed to delete task.');
    }
  };

  const handleStatusUpdate = async (task: SupabaseTask, nextStatus: Status) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', task.id);

      if (error) throw error;
      showFeedback('success', `Status set to ${nextStatus}.`);
      loadTasks(selectedDate);
    } catch (err) {
      console.error('Failed to update status:', err);
      showFeedback('error', 'Failed to update status.');
    }
  };

  const handlePublishDay = async () => {
    if (!confirm('Publish this day’s schedule to dashboard?')) return;

    setPublishing(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_published: true, updated_at: new Date().toISOString() })
        .eq('date', selectedDate);

      if (error) throw error;
      showFeedback('success', 'Day schedule published successfully.');
      loadTasks(selectedDate);
    } catch (err) {
      console.error('Failed to publish day:', err);
      showFeedback('error', 'Failed to publish day schedule.');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublishDay = async () => {
    if (!confirm('Unpublish this day’s schedule from dashboard?')) return;

    setPublishing(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_published: false, updated_at: new Date().toISOString() })
        .eq('date', selectedDate);

      if (error) throw error;
      showFeedback('success', 'Day schedule unpublished.');
      loadTasks(selectedDate);
    } catch (err) {
      console.error('Failed to unpublish day:', err);
      showFeedback('error', 'Failed to unpublish day schedule.');
    } finally {
      setPublishing(false);
    }
  };

  const isPublishedDay = tasks.length > 0 && tasks.every(task => task.is_published);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-text-primary pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* App Header */}
      <AppHeader subtitle="Database Execution Planner" showNavButtons={true} />

      {/* Toast Notification Banner */}
      {feedback && (
        <div className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-lg border shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-geist text-xs font-bold uppercase tracking-wider",
          feedback.type === 'success' 
            ? "bg-success/10 border-success/30 text-success" 
            : "bg-danger/10 border-danger/30 text-danger"
        )}>
          {feedback.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Planner Grid Area */}
      <main className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: List and Date selector (col-span-7) */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* Date Picker Card */}
          <div className="glass-panel bg-card border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="text-accent" size={18} />
              <div>
                <h2 className="font-geist text-xs font-bold text-text-secondary uppercase tracking-[0.1em]">Target Planner Date</h2>
                <p className="font-geist text-[10px] text-text-muted uppercase tracking-wider mt-0.5">Showing tasks for selected day</p>
              </div>
            </div>
            
            <input
              type="date"
              className="bg-background border border-border rounded-lg px-4 py-2 text-text-primary text-xs font-geist font-bold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 w-full sm:w-auto"
              value={selectedDate}
              onChange={(e) => {
                const nextDate = e.target.value;
                setSelectedDate(nextDate);
                setDate(nextDate);
                if (editingTask) resetForm(nextDate);
              }}
            />
          </div>

          {/* Publish Control Card */}
          {tasks.length > 0 && (
            <div className="glass-panel bg-card border border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-geist font-bold uppercase tracking-wider border flex-shrink-0",
                  isPublishedDay 
                    ? "bg-success/10 text-success border-success/20" 
                    : "bg-warning/10 text-warning border-warning/20"
                )}>
                  {isPublishedDay ? 'Published' : 'Draft'}
                </div>
                <div>
                  <h3 className="font-geist text-xs font-bold text-text-primary uppercase tracking-wider">
                    {isPublishedDay ? 'Schedule is Live' : 'Unpublished Draft'}
                  </h3>
                  <p className="font-geist text-[9px] text-text-muted uppercase tracking-wide mt-0.5">
                    {isPublishedDay ? 'All modules are visible on execution screens' : 'Changes are stored in database but not published'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handlePublishDay}
                  disabled={publishing || isPublishedDay}
                  className={cn(
                    "px-4 py-2 text-[10px] font-geist font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer w-full sm:w-auto text-center",
                    isPublishedDay
                      ? "bg-transparent border-border text-text-muted cursor-not-allowed"
                      : "bg-accent hover:bg-blue-700 text-text-primary border-accent shadow-md shadow-accent/10"
                  )}
                >
                  {publishing ? 'Publishing...' : 'Publish Day'}
                </button>
                {isPublishedDay && (
                  <button
                    type="button"
                    onClick={handleUnpublishDay}
                    disabled={publishing}
                    className="px-3 py-2 bg-transparent hover:bg-danger/10 border border-border hover:border-danger/20 text-text-muted hover:text-danger rounded-lg text-[10px] font-geist font-bold uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto text-center"
                  >
                    Unpublish
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Task Schedule Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock size={14} className="text-accent" />
              <h3 className="font-geist text-xs font-bold uppercase tracking-[0.2em]">Operational Schedule</h3>
            </div>
            <span className="font-geist text-[10px] text-text-muted uppercase tracking-wider">
              {tasks.length} Modules Scheduled
            </span>
          </div>

          {/* Task Schedule Cards */}
          <div className="space-y-4">
            {loading ? (
              <div className="glass-panel p-16 text-center border border-border bg-card">
                <RefreshCw size={24} className="animate-spin mx-auto text-accent mb-4" />
                <p className="text-text-secondary font-geist text-xs font-bold uppercase tracking-wider">Retrieving schedule...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="glass-panel p-16 text-center border border-dashed border-border/60 bg-card/40">
                <Calendar size={32} className="mx-auto text-text-muted mb-4" />
                <p className="text-text-secondary font-geist text-xs font-bold uppercase tracking-widest">No Tasks Scheduled</p>
                <p className="text-text-muted text-[11px] mt-1">There are no operational modules deployed for this date.</p>
              </div>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  className={cn(
                    "glass-panel bg-card border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-border/80",
                    task.status === 'done' ? "border-success/20 bg-success/2" : "border-border"
                  )}
                >
                  <div className="flex items-start gap-3 flex-grow min-w-0">
                    <div className="flex-shrink-0 text-center w-16 bg-background/50 border border-border/50 rounded-lg p-2 flex flex-col justify-center">
                      <span className="font-geist text-xs font-bold text-text-primary block tabular-nums">
                        {task.start_time || 'ASAP'}
                      </span>
                      {task.end_time && (
                        <span className="text-[9px] font-semibold text-text-muted mt-0.5 border-t border-border/30 pt-0.5 tabular-nums">
                          to {task.end_time}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-grow">
                      <h4 className={cn(
                        "font-geist font-bold text-sm text-text-primary truncate",
                        task.status === 'done' && "text-text-muted line-through"
                      )}>
                        {task.title}
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <PriorityBadge priority={task.priority as Priority} />
                        
                        {/* Status update select dropdown */}
                        <select
                          className="bg-card-elevated border border-border/60 text-[9px] font-geist font-bold uppercase tracking-wider px-1.5 py-0.5 rounded focus:outline-none focus:border-accent cursor-pointer text-text-secondary"
                          value={task.status}
                          onChange={(e) => handleStatusUpdate(task, e.target.value as Status)}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">Active</option>
                          <option value="delegated">Delegated</option>
                          <option value="done">Done</option>
                          <option value="delayed">Delayed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end sm:border-l sm:border-border/60 sm:pl-4">
                    <button
                      onClick={() => handleEditInit(task)}
                      className="p-2 bg-background hover:bg-card-elevated border border-border rounded text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                      title="Edit task parameters"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 bg-background hover:bg-danger/10 border border-border hover:border-danger/20 rounded text-text-muted hover:text-danger transition-colors cursor-pointer"
                      title="Delete task module"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right column: Form editor (col-span-5) */}
        <section className="lg:col-span-5">
          <form 
            onSubmit={handleSubmit}
            className="glass-panel bg-card-elevated border border-border p-5 md:p-6 rounded-xl space-y-5 shadow-lg"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Plus size={16} className="text-accent" />
                <h3 className="font-geist text-xs font-bold text-text-primary uppercase tracking-[0.15em]">
                  {editingTask ? 'Edit Task Module' : 'Deploy Task Module'}
                </h3>
              </div>
              {editingTask && (
                <button
                  type="button"
                  onClick={() => resetForm(selectedDate)}
                  className="p-1 bg-background hover:bg-card border border-border rounded text-text-muted hover:text-text-primary cursor-pointer transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Task Title *</label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-text-primary text-xs font-inter focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Executive Sync on Series B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Date *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-text-primary text-xs font-geist font-bold focus:outline-none focus:border-accent"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Priority</label>
                  <select
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-text-primary text-xs font-geist font-bold focus:outline-none cursor-pointer"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Start Time</label>
                  <input
                    type="time"
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-text-primary text-xs font-geist font-bold focus:outline-none"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">End Time</label>
                  <input
                    type="time"
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-text-primary text-xs font-geist font-bold focus:outline-none"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {editingTask && (
                <div>
                  <label className="block font-geist text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Execution Status</label>
                  <select
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-text-primary text-xs font-geist font-bold focus:outline-none cursor-pointer"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">Active</option>
                    <option value="delegated">Delegated</option>
                    <option value="done">Done</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-blue-700 text-text-primary font-geist font-bold text-xs rounded-lg uppercase tracking-wider transition-all shadow-md shadow-accent/15 cursor-pointer"
              >
                {editingTask ? 'Apply Changes' : 'Deploy to Planner'}
              </button>
            </div>
          </form>
        </section>

      </main>
    </div>
  );
}
