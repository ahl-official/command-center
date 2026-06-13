'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { taskStore } from '@/lib/task-store';
import { AdminTaskForm } from '@/components/AdminTaskForm';
import { AppHeader } from '@/components/AppHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { Trash2, Edit2, CheckCircle2, Circle, Clock, Zap, User, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    const initTasks = () => setTasks(taskStore.getTasks());
    initTasks();
    const handleUpdate = () => setTasks(taskStore.getTasks());
    window.addEventListener('storage-update', handleUpdate);
    return () => window.removeEventListener('storage-update', handleUpdate);
  }, []);

  const loadData = () => setTasks(taskStore.getTasks());

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to terminate this task module?')) {
      taskStore.deleteTask(id);
    }
  };

  const toggleDone = (task: Task) => {
    taskStore.updateTask(task.id, { 
      status: task.status === 'done' ? 'pending' : 'done',
      isRightNow: task.status === 'done' ? task.isRightNow : false
    });
  };

  const setRightNow = (id: string) => {
    taskStore.setRightNow(id);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all tasks to original demo seeds? Your custom tasks will be replaced.')) {
      taskStore.resetData();
      loadData();
    }
  };

  const actionButtons = (
    <div className="flex items-center gap-2 w-full">
      <button
        onClick={handleResetData}
        className="flex-1 md:flex-initial px-3 py-2 bg-card-elevated hover:bg-background border border-border text-text-secondary hover:text-text-primary rounded-lg text-[10px] md:text-xs font-geist font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
        title="Reset all tasks to defaults"
      >
        Reset Data
      </button>
      <button
        onClick={() => {
          setEditingTask(undefined);
          setShowForm(!showForm);
        }}
        className={cn(
          "flex-1 md:flex-initial px-3 py-2 text-text-primary rounded-lg text-[10px] md:text-xs font-geist font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer",
          showForm 
            ? "bg-danger hover:bg-red-700" 
            : "bg-accent hover:bg-blue-700 shadow-md shadow-accent/15"
        )}
      >
        {showForm ? (
          <>
            <X size={12} /> Close
          </>
        ) : (
          <>
            <Plus size={12} /> Deploy
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-text-primary pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* AppHeader Component with Custom action buttons */}
      <AppHeader 
        subtitle="System Operations & Task Deployment" 
        showNavButtons={true} 
        actionButtons={actionButtons}
      />

      {/* Slide-in Admin Task Creation/Modification Form */}
      {showForm && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
          <AdminTaskForm 
            initialTask={editingTask} 
            onSuccess={() => {
              setShowForm(false);
              setEditingTask(undefined);
              loadData();
            }} 
          />
        </div>
      )}

      {/* Task Inventory Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2 text-text-secondary">
            <Zap size={16} className="text-accent" />
            <h2 className="font-geist text-xs font-bold uppercase tracking-[0.2em]">
              Operational Inventory
            </h2>
          </div>
          <span className="font-geist text-[10px] font-bold text-text-muted uppercase tracking-wider">
            {tasks.length} Modules Active
          </span>
        </div>
        
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
              <Zap size={40} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary font-geist font-bold uppercase tracking-widest text-sm">
                Inventory Empty
              </p>
              <p className="text-text-muted text-xs mt-1">
                Deploy your first operation module to begin monitoring.
              </p>
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={cn(
                  "bg-card border rounded-xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all",
                  task.isRightNow 
                    ? "border-accent/40 bg-accent/5" 
                    : "border-border hover:border-text-muted"
                )}
              >
                {/* Left Side: Status Toggle + Meta Details */}
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <button 
                    onClick={() => toggleDone(task)}
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer",
                      task.status === 'done' 
                        ? "bg-success border-success text-background" 
                        : "bg-background border-border text-text-muted hover:border-accent hover:text-accent"
                    )}
                  >
                    {task.status === 'done' ? (
                      <CheckCircle2 size={18} className="stroke-[3]" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  
                  <div className="min-w-0 flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className={cn(
                        "font-geist font-bold text-base tracking-tight truncate max-w-sm sm:max-w-md",
                        task.status === 'done' ? "text-text-muted line-through" : "text-text-primary"
                      )}>
                        {task.title}
                      </h3>
                      <div className="flex gap-1.5">
                        <PriorityBadge priority={task.priority} />
                        <span className="font-geist text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-card-elevated border border-border/60 text-text-secondary">
                          {task.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-text-muted text-[11px] font-medium font-inter">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-accent" />
                        <span className="tabular-nums">Due: {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}</span>
                      </div>
                      
                      {task.owner && (
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-accent" />
                          <span>Owner: {task.owner}</span>
                        </div>
                      )}
                      
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </div>

                {/* Right Side: Command Actions */}
                <div className="flex items-center gap-3 justify-end flex-shrink-0">
                  {/* Mark Focus / Right Now */}
                  {!task.isRightNow && task.status !== 'done' && (
                    <button 
                      onClick={() => setRightNow(task.id)}
                      className="px-3 py-1.5 bg-background hover:bg-accent hover:border-accent text-text-secondary hover:text-text-primary text-[10px] font-geist font-bold uppercase tracking-wider rounded border border-border transition-all cursor-pointer"
                    >
                      Set Focus
                    </button>
                  )}
                  
                  {task.isRightNow && (
                    <div className="px-3 py-1.5 bg-accent/15 text-primary text-[10px] font-geist font-bold uppercase tracking-wider rounded border border-accent/30 flex items-center gap-1">
                      <Zap size={10} className="animate-pulse" />
                      Active Focus
                    </div>
                  )}
                  
                  {/* Edit/Delete actions */}
                  <div className="flex items-center gap-1.5 border-l border-border pl-3">
                    <button 
                      onClick={() => {
                        setEditingTask(task);
                        setShowForm(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 rounded bg-background hover:bg-card-elevated text-text-muted hover:text-text-primary border border-border transition-all cursor-pointer"
                      title="Edit Mission Module"
                    >
                      <Edit2 size={12} />
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-2 rounded bg-background hover:bg-danger/10 text-text-muted hover:text-danger border border-border hover:border-danger/30 transition-all cursor-pointer"
                      title="Terminate Module"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
