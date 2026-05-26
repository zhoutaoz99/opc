import type { Task } from './types';
import { STATUS_LABEL, STATUS_COLOR } from './types';
import { escapeHtml } from './render';
import { marked } from 'marked';

let currentTask: Task | null = null;

export function openDetail(task: Task, onUpdate: (task: Task) => void): void {
  currentTask = task;
  const overlay = document.getElementById('detailOverlay')!;
  overlay.classList.remove('hidden');

  document.getElementById('detailContent')!.innerHTML = renderDetailContent(task);

  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  overlay.onclick = (e) => {
    if (e.target === overlay) closeDetail();
  };

  const closeBtn = document.getElementById('detailClose');
  if (closeBtn) closeBtn.onclick = closeDetail;

  const noteArea = document.getElementById('detailNoteArea') as HTMLTextAreaElement;
  const saveNoteBtn = document.getElementById('detailSaveNote');
  if (saveNoteBtn && noteArea) {
    saveNoteBtn.onclick = () => {
      const notes = noteArea.value;
      onUpdate({ ...task, notes });
    };
  }
}

export function closeDetail(): void {
  const overlay = document.getElementById('detailOverlay')!;
  overlay.classList.add('hidden');
  document.body.style.overflow = '';
  currentTask = null;
}

export function getCurrentTask(): Task | null {
  return currentTask;
}

function renderDetailContent(t: Task): string {
  let detailHtml = '<div class="detail-empty">暂无详细步骤</div>';
  if (t.details) {
    const rawHtml = marked.parse(t.details, { async: false }) as string;
    detailHtml = rawHtml.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
  }

  return `
    <div class="detail-header">
      <span class="detail-phase-badge">${escapeHtml(t.phase)}</span>
      <span class="detail-status" style="color:${STATUS_COLOR[t.status]};background:${STATUS_COLOR[t.status]}11;border:1px solid ${STATUS_COLOR[t.status]}33">${STATUS_LABEL[t.status]}</span>
    </div>
    <h2 class="detail-title">${escapeHtml(t.title)}</h2>
    <p class="detail-desc">${escapeHtml(t.description)}</p>
    <div class="detail-body">${detailHtml}</div>
    <div class="detail-notes-section">
      <h3 class="detail-section-title">备注</h3>
      <textarea id="detailNoteArea" class="detail-textarea" placeholder="添加个人备注...">${escapeHtml(t.notes || '')}</textarea>
      <div class="detail-note-actions">
        <button id="detailSaveNote" class="save-btn">保存备注</button>
      </div>
    </div>
  `;
}
