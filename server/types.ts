export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface Task {
  id: number;
  phase: string;
  phase_order: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SeedTask {
  phase: string;
  phase_order: number;
  title: string;
  description: string;
  details: string;
  sort_order: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  phases: PhaseStats[];
}

export interface PhaseStats {
  phase: string;
  phase_order: number;
  done: string;
  total: string;
}
