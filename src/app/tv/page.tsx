'use client';

import { useState, useEffect } from 'react';
import { Task, Meeting } from '@/lib/types';
import { taskStore } from '@/lib/task-store';
import { TVDashboard } from '@/components/TVDashboard';
import { supabase } from '@/lib/supabase/client';
import { SupabaseTask } from '@/lib/supabase/types';

export default function TVPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [supabaseTasks, setSupabaseTasks] = useState<SupabaseTask[]>([]);

  useEffect(() => {
    const loadLocalData = () => {
      setTasks(taskStore.getTasks());
      setMeetings(taskStore.getMeetings());
    };

    const loadSupabaseData = async () => {
      try {
        const today = new Date().toLocaleDateString('en-CA');
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('date', today)
          .eq('is_published', true)
          .order('start_time', { ascending: true, nullsFirst: false });

        if (error) throw error;
        setSupabaseTasks((data as SupabaseTask[]) || []);
      } catch (err) {
        console.error('Failed to load schedule from Supabase:', err);
      }
    };

    loadLocalData();

    // Load from Supabase asynchronously
    const supabaseTimer = setTimeout(() => {
      loadSupabaseData();
    }, 0);

    window.addEventListener('storage-update', loadLocalData);
    window.addEventListener('storage', loadLocalData);
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      loadLocalData();
      loadSupabaseData();
    }, 30000);

    return () => {
      window.removeEventListener('storage-update', loadLocalData);
      window.removeEventListener('storage', loadLocalData);
      clearTimeout(supabaseTimer);
      clearInterval(refreshInterval);
    };
  }, []);

  return <TVDashboard tasks={tasks} meetings={meetings} supabaseTasks={supabaseTasks} />;
}
