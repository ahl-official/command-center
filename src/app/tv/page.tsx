'use client';

import { useState, useEffect } from 'react';
import { Task, Meeting } from '@/lib/types';
import { taskStore } from '@/lib/task-store';
import { TVDashboard } from '@/components/TVDashboard';

export default function TVPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const loadData = () => {
      setTasks(taskStore.getTasks());
      setMeetings(taskStore.getMeetings());
    };

    loadData();
    window.addEventListener('storage-update', loadData);
    window.addEventListener('storage', loadData);
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(loadData, 30000);

    return () => {
      window.removeEventListener('storage-update', loadData);
      window.removeEventListener('storage', loadData);
      clearInterval(refreshInterval);
    };
  }, []);

  return <TVDashboard tasks={tasks} meetings={meetings} />;
}
