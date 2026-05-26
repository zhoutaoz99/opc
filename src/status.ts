import type { TaskStatus } from './types';
import { STATUS_FLOW, STATUS_COLOR, STATUS_LABEL } from './types';

let activeStatusMenu: HTMLDivElement | null = null;

export function showStatusMenu(e: MouseEvent, taskId: number, onSetStatus: (id: number, status: TaskStatus) => void): void {
  e.stopPropagation();
  closeStatusMenu();
  const menu = document.createElement('div');
  menu.className = 'status-menu';
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  menu.style.top = (rect.bottom + 6) + 'px';
  menu.style.left = rect.left + 'px';

  requestAnimationFrame(() => {
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth - 10) {
      menu.style.left = (window.innerWidth - menuRect.width - 10) + 'px';
    }
  });

  STATUS_FLOW.forEach(s => {
    const opt = document.createElement('div');
    opt.className = 'status-option';
    opt.innerHTML = `<span class="status-dot" style="background:${STATUS_COLOR[s]}"></span>${STATUS_LABEL[s]}`;
    opt.onclick = () => { onSetStatus(taskId, s); closeStatusMenu(); };
    menu.appendChild(opt);
  });

  document.body.appendChild(menu);
  activeStatusMenu = menu;
}

export function closeStatusMenu(): void {
  if (activeStatusMenu) {
    activeStatusMenu.remove();
    activeStatusMenu = null;
  }
}
