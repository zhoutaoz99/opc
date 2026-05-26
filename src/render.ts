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
        <div class="task-info">
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

export function render(allTasks: Task[], currentFilter: string): void {
  const phases: Record<string, Task[]> = {};
  const phaseOrder: { name: string; order: number }[] = [];

  const filtered = currentFilter === 'all'
    ? allTasks
    : allTasks.filter(t => t.status === currentFilter);

  filtered.forEach(t => {
    if (!phases[t.phase]) {
      phases[t.phase] = [];
      phaseOrder.push({ name: t.phase, order: t.phase_order });
    }
    phases[t.phase].push(t);
  });

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

  document.getElementById('filterBar')!.innerHTML = `
    <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">全部 (${allTasks.length})</button>
    <button class="filter-btn ${currentFilter === 'pending' ? 'active' : ''}" data-filter="pending">待开始 (${pending})</button>
    <button class="filter-btn ${currentFilter === 'in-progress' ? 'active' : ''}" data-filter="in-progress">进行中 (${inProgress})</button>
    <button class="filter-btn ${currentFilter === 'done' ? 'active' : ''}" data-filter="done">已完成 (${done})</button>
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

  let html = '';
  phaseOrder.forEach((po, idx) => {
    const tasks = phases[po.name];
    const phaseDone = tasks.filter(t => t.status === 'done').length;
    html += `
      <div class="phase-section" style="animation-delay: ${idx * 0.05}s">
        <div class="phase-header">
          <h2>${po.name}</h2>
          <span class="phase-badge">${phaseDone}/${tasks.length} 完成</span>
        </div>
        ${tasks.map(t => renderTask(t)).join('')}
      </div>
    `;
  });

  listEl.innerHTML = html;
}
