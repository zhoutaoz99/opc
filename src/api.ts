import type { Task } from './types';

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch('/api/tasks');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch('/api/stats');
  return res.json();
}

export async function updateTask(id: number, data: Partial<Pick<Task, 'status' | 'notes'>>): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function resetTasks(): Promise<void> {
  await fetch('/api/tasks/reset', { method: 'POST' });
}
