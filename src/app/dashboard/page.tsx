'use client';

import { useState, useEffect } from 'react';
import { Task, Meeting } from '@/lib/types';
import { taskStore } from '@/lib/task-store';
import { MobileDashboard } from '@/components/MobileDashboard';

export default function DashboardPage() {
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

    return () => {
      window.removeEventListener('storage-update', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  return <MobileDashboard tasks={tasks} meetings={meetings} />;
}
