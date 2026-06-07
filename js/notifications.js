/**
 * Mindless — Notifications
 */
export const notifications = {
  isSupported: 'Notification' in window && 'serviceWorker' in navigator,

  async requestPermission() {
    if (!this.isSupported) return false;
    if (Notification.permission === 'granted') return true;
    return (await Notification.requestPermission()) === 'granted';
  },

  async showLocal(title, opts = {}) {
    if (!this.isSupported || Notification.permission !== 'granted') return;
    const reg = await navigator.serviceWorker.ready;
    reg.showNotification(title, { icon: 'icons/icon-192x192.svg', ...opts });
  }
};
