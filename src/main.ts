import type { Task, TaskStatus } from './types';
import { STATUS_FLOW } from './types';
import { fetchTasks, updateTask } from './api';
import { render } from './render';
import { showStatusMenu, closeStatusMenu } from './status';
import { triggerConfetti } from './confetti';
import { openDetail, closeDetail, getCurrentTask } from './detail';

let allTasks: Task[] = [];
let currentFilter = 'all';
let currentPhase = '';

// --- Core actions ---

function cycleStatus(task: Task): void {
  const idx = STATUS_FLOW.indexOf(task.status);
  const next = STATUS_FLOW[(idx + 1) % STATUS_FLOW.length];
  updateTask(task.id, { status: next }).then(updated => {
    const i = allTasks.findIndex(t => t.id === updated.id);
    allTasks[i] = updated;
    if (next === 'done') triggerConfetti();
    renderAll();
  });
}

function setStatus(taskId: number, status: TaskStatus): void {
  updateTask(taskId, { status }).then(updated => {
    const i = allTasks.findIndex(t => t.id === updated.id);
    allTasks[i] = updated;
    if (status === 'done') triggerConfetti();
    renderAll();
  });
}

function toggleNotes(taskId: number): void {
  const el = document.querySelector(`[data-notes-id="${taskId}"]`) as HTMLElement;
  el.classList.toggle('hidden');
  if (!el.classList.contains('hidden')) {
    el.querySelector('textarea')!.focus();
  }
}

function saveNotes(taskId: number): void {
  const ta = document.querySelector(`[data-notes-id="${taskId}"] textarea`) as HTMLTextAreaElement;
  const notes = ta.value;
  updateTask(taskId, { notes }).then(updated => {
    const i = allTasks.findIndex(t => t.id === updated.id);
    allTasks[i] = updated;
    renderAll();
  });
}

function cancelNotes(taskId: number): void {
  const el = document.querySelector(`[data-notes-id="${taskId}"]`) as HTMLElement;
  el.classList.add('hidden');
}

function setFilter(filter: string): void {
  currentFilter = filter;
  renderAll();
}

function setPhase(phase: string): void {
  currentPhase = phase;
  currentFilter = 'all';
  renderAll();
}

// --- Rendering ---

function renderAll(): void {
  render(allTasks, currentFilter, currentPhase);
}

// --- Event delegation ---

document.getElementById('taskList')!.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const card = target.closest('.task-card') as HTMLElement | null;
  if (!card) return;
  const taskId = Number(card.getAttribute('data-task-id'));

  if (target.closest('.task-checkbox')) {
    const task = allTasks.find(t => t.id === taskId);
    if (task) cycleStatus(task);
    return;
  }

  if (target.closest('.status-btn')) {
    showStatusMenu(e, taskId, setStatus);
    return;
  }

  if (target.closest('.notes-btn')) {
    toggleNotes(taskId);
    return;
  }

  if (target.closest('.save-btn')) {
    saveNotes(taskId);
    return;
  }

  if (target.closest('.cancel-btn')) {
    cancelNotes(taskId);
    return;
  }
});

document.getElementById('filterBar')!.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest('.filter-btn') as HTMLElement | null;
  if (!btn) return;
  const filter = btn.getAttribute('data-filter');
  if (filter) setFilter(filter);
});

document.getElementById('phaseBar')!.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest('.phase-tab') as HTMLElement | null;
  if (!btn) return;
  const phase = btn.getAttribute('data-phase');
  if (phase) setPhase(phase);
});

document.addEventListener('click', closeStatusMenu);

// --- Detail view ---

function handleDetailUpdate(updated: Task): void {
  updateTask(updated.id, { notes: updated.notes }).then(saved => {
    const i = allTasks.findIndex(t => t.id === saved.id);
    if (i >= 0) allTasks[i] = saved;
    renderAll();
  });
}

document.getElementById('taskList')!.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const trigger = target.closest('[data-detail-trigger]') as HTMLElement | null;
  if (!trigger) return;
  const card = trigger.closest('.task-card') as HTMLElement;
  if (!card) return;
  const taskId = Number(card.getAttribute('data-task-id'));
  const task = allTasks.find(t => t.id === taskId);
  if (task) openDetail(task, handleDetailUpdate);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const detailOverlay = document.getElementById('detailOverlay');
    if (detailOverlay && !detailOverlay.classList.contains('hidden')) {
      closeDetail();
    }
  }
});

// --- Data loading ---

async function loadTasks(): Promise<void> {
  try {
    allTasks = await fetchTasks();
    // Default to the first incomplete phase, or the first phase if all done
    const phases = new Map<number, string>();
    allTasks.forEach(t => {
      if (!phases.has(t.phase_order)) {
        phases.set(t.phase_order, t.phase);
      }
    });
    const sortedPhaseOrders = Array.from(phases.keys()).sort((a, b) => a - b);

    let defaultPhase = '';
    for (const order of sortedPhaseOrders) {
      const phaseName = phases.get(order)!;
      const tasksInPhase = allTasks.filter(t => t.phase === phaseName);
      const doneInPhase = tasksInPhase.filter(t => t.status === 'done').length;
      if (doneInPhase < tasksInPhase.length) {
        defaultPhase = phaseName;
        break;
      }
    }
    if (!defaultPhase && sortedPhaseOrders.length > 0) {
      defaultPhase = phases.get(sortedPhaseOrders[0])!;
    }
    currentPhase = defaultPhase;
    currentFilter = 'all';
    renderAll();
  } catch {
    document.getElementById('taskList')!.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <div class="empty-state-title">加载失败</div>
        <div class="empty-state-desc">无法连接到服务器，请稍后再试</div>
      </div>
    `;
  }
}

loadTasks();
