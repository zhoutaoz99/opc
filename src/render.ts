import type { Task } from './types';
import { STATUS_COLOR, STATUS_LABEL } from './types';

export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderTask(t: Task): string {
  const checkClass = t.status === 'done' ? 'checked'
    : t.status === 'in-progress' ? 'in-progress-check' : '';
  const cardClass = t.status === 'done' ? 'done'
    : t.status === 'in-progress' ? 'in-progress' : '';

  const notesHtml = t.notes
    ? `<div class="notes-display">${escapeHtml(t.notes)}</div>`
    : '';

  return `
    <div class="task-card ${cardClass}" data-task-id="${t.id}">
      <div class="task-top">
        <div class="task-checkbox ${checkClass}" title="点击切换状态"></div>
        <div class="task-info" data-detail-trigger>
          <div class="task-title">${escapeHtml(t.title)}</div>
          <div class="task-desc">${escapeHtml(t.description)}</div>
          ${notesHtml}
        </div>
        <div class="task-actions">
          <button class="action-btn status-btn" style="color:${STATUS_COLOR[t.status]};border-color:${STATUS_COLOR[t.status]}33;background:${STATUS_COLOR[t.status]}11">
            ${STATUS_LABEL[t.status]}
          </button>
          <button class="action-btn notes-btn">
            ${t.notes ? '编辑备注' : '添加备注'}
          </button>
        </div>
      </div>
      <div class="task-notes hidden" data-notes-id="${t.id}">
        <textarea class="notes-textarea" placeholder="输入备注...">${escapeHtml(t.notes || '')}</textarea>
        <div class="notes-actions">
          <button class="cancel-btn">取消</button>
          <button class="save-btn">保存</button>
        </div>
      </div>
    </div>
  `;
}

function getPhaseProgress(allTasks: Task[], phaseName: string): { done: number; total: number } {
  const tasks = allTasks.filter(t => t.phase === phaseName);
  const done = tasks.filter(t => t.status === 'done').length;
  return { done, total: tasks.length };
}

export function renderPhaseTabs(allTasks: Task[], currentPhase: string): void {
  const phases: Record<string, { name: string; order: number }> = {};
  allTasks.forEach(t => {
    if (!phases[t.phase]) {
      phases[t.phase] = { name: t.phase, order: t.phase_order };
    }
  });

  const sortedPhases = Object.values(phases).sort((a, b) => a.order - b.order);

  const html = sortedPhases.map(p => {
    const { done, total } = getPhaseProgress(allTasks, p.name);
    const isActive = p.name === currentPhase;
    const pct = total ? Math.round(done / total * 100) : 0;
    const isCompleted = done === total && total > 0;

    return `
      <button
        class="phase-tab ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
        data-phase="${escapeHtml(p.name)}"
        title="${escapeHtml(p.name)} — ${done}/${total} 完成"
      >
        <span class="phase-tab-name">${escapeHtml(p.name)}</span>
        <span class="phase-tab-progress">${done}/${total}</span>
        ${isCompleted ? '<span class="phase-tab-check">✓</span>' : ''}
      </button>
    `;
  }).join('');

  document.getElementById('phaseBar')!.innerHTML = html;
}

export function render(allTasks: Task[], currentFilter: string, currentPhase: string): void {
  const done = allTasks.filter(t => t.status === 'done').length;
  const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
  const pending = allTasks.filter(t => t.status === 'pending').length;
  const pct = allTasks.length ? Math.round(done / allTasks.length * 100) : 0;

  document.getElementById('statsBar')!.innerHTML = `
    <div class="stat-card total"><div class="number">${allTasks.length}</div><div class="label">总任务</div></div>
    <div class="stat-card done"><div class="number">${done}</div><div class="label">已完成</div></div>
    <div class="stat-card in-progress"><div class="number">${inProgress}</div><div class="label">进行中</div></div>
    <div class="stat-card pending"><div class="number">${pending}</div><div class="label">待开始</div></div>
  `;

  document.getElementById('progressFill')!.style.width = pct + '%';
  document.getElementById('progressText')!.textContent = `${pct}%（${done}/${allTasks.length}）`;

  // Phase tabs
  renderPhaseTabs(allTasks, currentPhase);

  // Phase header inside task list
  const phaseTasks = allTasks.filter(t => t.phase === currentPhase);
  const phaseDone = phaseTasks.filter(t => t.status === 'done').length;
  const phaseTotal = phaseTasks.length;

  const filtered = currentFilter === 'all'
    ? phaseTasks
    : phaseTasks.filter(t => t.status === currentFilter);

  document.getElementById('filterBar')!.innerHTML = `
    <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">全部 (${phaseTotal})</button>
    <button class="filter-btn ${currentFilter === 'pending' ? 'active' : ''}" data-filter="pending">待开始 (${phaseTasks.filter(t => t.status === 'pending').length})</button>
    <button class="filter-btn ${currentFilter === 'in-progress' ? 'active' : ''}" data-filter="in-progress">进行中 (${phaseTasks.filter(t => t.status === 'in-progress').length})</button>
    <button class="filter-btn ${currentFilter === 'done' ? 'active' : ''}" data-filter="done">已完成 (${phaseTasks.filter(t => t.status === 'done').length})</button>
  `;

  const listEl = document.getElementById('taskList')!;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-title">暂无任务</div>
        <div class="empty-state-desc">该筛选条件下没有任务</div>
      </div>
    `;
    return;
  }

  listEl.innerHTML = `
    <div class="phase-section active">
      <div class="phase-header">
        <h2>${escapeHtml(currentPhase)}</h2>
        <span class="phase-badge">${phaseDone}/${phaseTotal} 完成</span>
      </div>
      ${filtered.map(t => renderTask(t)).join('')}
    </div>
  `;
}
