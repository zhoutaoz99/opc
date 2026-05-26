export function confirmReset(onConfirm: () => void): void {
  document.getElementById('dialogContainer')!.innerHTML = `
    <div class="dialog-overlay" id="dialogOverlay">
      <div class="dialog">
        <h3>确认重置</h3>
        <p>将所有任务重置为"待开始"状态，并清除所有备注。此操作不可撤销。</p>
        <div class="dialog-actions">
          <button class="dialog-btn cancel" id="dialogCancel">取消</button>
          <button class="dialog-btn confirm" id="dialogConfirm">确认重置</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('dialogOverlay')!.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDialog();
  });
  document.getElementById('dialogCancel')!.addEventListener('click', closeDialog);
  document.getElementById('dialogConfirm')!.addEventListener('click', () => {
    closeDialog();
    onConfirm();
  });
}

export function closeDialog(): void {
  document.getElementById('dialogContainer')!.innerHTML = '';
}
