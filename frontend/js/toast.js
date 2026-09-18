/**
 * DevTrack - Toast Notification & Confirm Modal Manager
 */

const Toast = {
  /**
   * Show a toast message
   * @param {string} message 
   * @param {'success'|'error'} type 
   */
  show(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success' 
      ? `<svg width="20" height="20" fill="none" stroke="#10b981" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
      : `<svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <span style="font-size:0.9rem; font-weight:600;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  success(msg) {
    this.show(msg, 'success');
  },

  error(msg) {
    this.show(msg, 'error');
  }
};

/**
 * Custom Confirmation Dialog Handler
 */
const ConfirmModal = {
  show({ title, message, confirmText = 'Delete', onConfirm }) {
    const overlay = document.getElementById('confirmModalOverlay');
    const titleEl = document.getElementById('confirmModalTitle');
    const msgEl = document.getElementById('confirmModalMessage');
    const actionBtn = document.getElementById('confirmModalActionBtn');
    const cancelBtn = document.getElementById('confirmModalCancelBtn');

    if (!overlay || !titleEl || !msgEl || !actionBtn) return;

    titleEl.textContent = title || 'Confirm Action';
    msgEl.textContent = message || 'Are you sure you want to proceed?';
    actionBtn.textContent = confirmText;

    const handleConfirm = () => {
      cleanup();
      if (onConfirm) onConfirm();
    };

    const cleanup = () => {
      overlay.classList.remove('active');
      actionBtn.removeEventListener('click', handleConfirm);
    };

    actionBtn.addEventListener('click', handleConfirm, { once: true });
    cancelBtn.onclick = cleanup;
    overlay.onclick = (e) => { if (e.target === overlay) cleanup(); };

    overlay.classList.add('active');
  }
};
