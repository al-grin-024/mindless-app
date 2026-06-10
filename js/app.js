/**
 * Mindless — Main Entry Point
 */
import { store } from './store.js';
import { router } from './router.js';
import { auth } from './auth.js';
import { initI18n } from './i18n.js';
import { voice } from './voice.js';

// Register Web Components (must load before router renders views)
import './components/nav-bar.js';
import './components/gradient-blob.js';
import './components/task-card.js';
import './components/voice-button.js';
import './components/color-picker.js';

async function bootstrap() {
  try {
    initI18n();
    await store.init();
    await auth.init();
    voice.init();
    router.init('app-view');
  } catch (e) {
    console.error('Bootstrap failed:', e);
    document.getElementById('app-view').innerHTML =
      '<div class="empty-state"><p class="empty-state__title">Something went wrong</p>' +
      '<button class="btn btn-primary" onclick="location.reload()">Reload</button></div>';
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);

// Service Worker — registered relative so its scope is the app subdirectory
// (MAMP hosts the app under /Antigravity/Personal/Home/).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW:', e));
  });
  // When a new SW takes control (e.g. after a code update), reload once so the
  // page runs the fresh code instead of whatever the old SW already served.
  let _reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (_reloaded) return;
    _reloaded = true;
    window.location.reload();
  });
}
