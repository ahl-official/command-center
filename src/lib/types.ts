export type Category = 'priority' | 'meeting' | 'approval' | 'delegated' | 'deadline' | 'alert';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'pending' | 'in-progress' | 'delegated' | 'done' | 'delayed';
export type Mode = 'call' | 'meeting' | 'online' | 'in-person';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  status: Status;
  owner?: string;
  dueDate: string; // ISO string or YYYY-MM-DD
  dueTime?: string; // HH:mm
  isRightNow: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  time: string; // HH:mm
  person: string;
  mode: Mode;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface DashboardData {
  tasks: Task[];
  meetings: Meeting[];
}
