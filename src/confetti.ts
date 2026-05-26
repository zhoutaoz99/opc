export function triggerConfetti(): void {
  const container = document.getElementById('confettiContainer')!;
  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.3 + 's';
    piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    piece.style.width = (6 + Math.random() * 6) + 'px';
    piece.style.height = (6 + Math.random() * 6) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }

  setTimeout(() => {
    container.innerHTML = '';
  }, 3000);
}
