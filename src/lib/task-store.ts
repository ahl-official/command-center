'use client';

import { Task, Meeting, DashboardData } from './types';
import { SEED_TASKS, SEED_MEETINGS } from './seed-data';

const STORAGE_KEY = 'command-center-execution-data';

export const taskStore = {
  getData(): DashboardData {
    if (typeof window === 'undefined') return { tasks: [], meetings: [] };
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initialData = { tasks: SEED_TASKS, meetings: SEED_MEETINGS };
      this.saveData(initialData);
      return initialData;
    }
    
    try {
      const parsed = JSON.parse(stored);
      // Validate structural sanity of parsed data
      if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.meetings)) {
        return parsed;
      }
      throw new Error('Invalid data structure parsed from localStorage');
    } catch (e) {
      console.error('Failed to parse storage, restoring seed defaults', e);
      const initialData = { tasks: SEED_TASKS, meetings: SEED_MEETINGS };
      this.saveData(initialData);
      return initialData;
    }
  },

  saveData(data: DashboardData) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Dispatch custom event for cross-tab or same-page reactivity
      window.dispatchEvent(new Event('storage-update'));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
    }
  },

  getTasks(): Task[] {
    return this.getData().tasks;
  },

  getMeetings(): Meeting[] {
    return this.getData().meetings;
  },

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const data = this.getData();
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If this task is marked as Right Now, unmark all others
    if (newTask.isRightNow) {
      data.tasks = data.tasks.map(t => ({ ...t, isRightNow: false }));
    }

    data.tasks.unshift(newTask);
    this.saveData(data);
    return newTask;
  },

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const data = this.getData();
    const index = data.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    // If updating to Right Now, unmark all others
    if (updates.isRightNow) {
      data.tasks = data.tasks.map(t => ({ ...t, isRightNow: false }));
    }

    const updatedTask = {
      ...data.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    data.tasks[index] = updatedTask;
    this.saveData(data);
    return updatedTask;
  },

  deleteTask(id: string) {
    const data = this.getData();
    data.tasks = data.tasks.filter(t => t.id !== id);
    this.saveData(data);
  },

  setRightNow(id: string) {
    const data = this.getData();
    data.tasks = data.tasks.map(t => ({
      ...t,
      isRightNow: t.id === id,
      updatedAt: t.id === id ? new Date().toISOString() : t.updatedAt,
    }));
    this.saveData(data);
  },

  resetData() {
    if (typeof window === 'undefined') return;
    const initialData = { tasks: SEED_TASKS, meetings: SEED_MEETINGS };
    this.saveData(initialData);
  }
};
