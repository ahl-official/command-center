'use client';

import { useState } from 'react';
import { Task, Category, Priority, Status } from '@/lib/types';
import { taskStore } from '@/lib/task-store';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface AdminTaskFormProps {
  onSuccess: () => void;
  initialTask?: Task;
}

export function AdminTaskForm({ onSuccess, initialTask }: AdminTaskFormProps) {
  const [formData, setFormData] = useState<Partial<Task>>(
    initialTask || {
      title: '',
      description: '',
      category: 'priority',
      priority: 'medium',
      status: 'pending',
      owner: '',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '',
      isRightNow: false,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.priority || !formData.status || !formData.dueDate) {
      alert('Please fill in required fields');
      return;
    }

    if (initialTask) {
      taskStore.updateTask(initialTask.id, formData);
    } else {
      taskStore.addTask(formData as Task);
    }
    onSuccess();
  };

  const labelClasses = "block font-geist text-xs font-semibold text-text-secondary uppercase tracking-[0.05em] mb-2";
  
  const inputClasses = cn(
    "w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary text-sm font-inter",
    "placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 transition-all"
  );

  const selectClasses = cn(
    "w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary text-sm font-inter cursor-pointer",
    "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 transition-all"
  );

  return (
    <form 
      onSubmit={handleSubmit} 
      className="glass-panel bg-card-elevated border border-border p-4 md:p-8 rounded-xl shadow-2xl max-w-4xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-2 mb-2 pb-4 border-b border-border">
        <ShieldCheck className="text-accent" size={18} />
        <h3 className="font-geist text-sm font-bold text-text-primary uppercase tracking-[0.1em]">
          {initialTask ? 'Modify Mission Parameters' : 'Deploy New Mission Module'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side fields */}
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Primary Title *</label>
            <input
              type="text"
              required
              className={inputClasses}
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Q3 Strategic Alignment Keynote"
            />
          </div>
          
          <div>
            <label className={labelClasses}>Detailed Context</label>
            <textarea
              className={cn(inputClasses, "h-[148px] resize-none")}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide the core objective, agenda, and parameters..."
            />
          </div>
        </div>

        {/* Right Side fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Category *</label>
              <select
                className={selectClasses}
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                <option value="priority">Priority</option>
                <option value="meeting">Meeting</option>
                <option value="approval">Approval</option>
                <option value="delegated">Delegated</option>
                <option value="deadline">Deadline</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            
            <div>
              <label className={labelClasses}>Priority *</label>
              <select
                className={selectClasses}
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
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
              <label className={labelClasses}>Status *</label>
              <select
                className={selectClasses}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as Status })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">Active</option>
                <option value="delegated">Delegated</option>
                <option value="done">Done</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>
            
            <div>
              <label className={labelClasses}>Lead / Owner</label>
              <input
                type="text"
                className={inputClasses}
                value={formData.owner}
                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Name or Department"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Due Date *</label>
              <input
                type="date"
                required
                className={inputClasses}
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            
            <div>
              <label className={labelClasses}>Due Time</label>
              <input
                type="time"
                className={inputClasses}
                value={formData.dueTime}
                onChange={e => setFormData({ ...formData, dueTime: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div 
          onClick={() => setFormData({ ...formData, isRightNow: !formData.isRightNow })}
          className="flex items-center gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors select-none"
        >
          <input
            type="checkbox"
            id="isRightNow"
            className="w-4 h-4 rounded border-border bg-background text-accent focus:ring-accent pointer-events-none"
            checked={formData.isRightNow}
            readOnly
          />
          <label htmlFor="isRightNow" className="text-xs font-geist font-bold text-accent uppercase tracking-wider cursor-pointer">
            Deploy as &quot;Right Now&quot; Active Focus
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-accent hover:bg-blue-700 text-text-primary font-geist font-bold text-xs rounded-lg uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-accent/15 cursor-pointer"
        >
          {initialTask ? 'Apply Module Updates' : 'Deploy Module to Command'}
        </button>
      </div>
    </form>
  );
}
