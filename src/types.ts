export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface Task {
  id: number;
  phase: string;
  phase_order: number;
  title: string;
  description: string | null;
  details: string | null;
  status: TaskStatus;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const STATUS_FLOW: TaskStatus[] = ['pending', 'in-progress', 'done'];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: '待开始',
  'in-progress': '进行中',
  done: '已完成',
};

export const STATUS_COLOR: Record<TaskStatus, string> = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  done: '#10b981',
};
