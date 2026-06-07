/**
 * Mindless — SPA Router (History API)
 * Handles MAMP subdirectory via BASE_PATH.
 */
import { store } from './store.js';

const BASE_PATH = location.pathname.indexOf('/Antigravity/Personal/Home') === 0
  ? '/Antigravity/Personal/Home' : '';

const routes = {
  '/':               () => import('./views/dashboard.js').then(m => m.default()),
  '/welcome':        () => import('./views/welcome.js').then(m => m.default()),
  '/onboarding':     () => import('./views/onboarding.js').then(m => m.default()),
  '/mini-world':     () => import('./views/mini-world.js').then(m => m.default()),
  '/profile':        () => import('./views/profile.js').then(m => m.default()),
  '/privacy-policy': () => import('./views/privacy-policy.js').then(m => m.default()),
  '/terms':          () => import('./views/terms.js').then(m => m.default()),
  '/confirmation':   () => import('./views/confirmation.js').then(m => m.default()),
  '/calendar':       () => import('./views/calendar.js').then(m => m.default()),
  '/tasks':          () => import('./views/tasks.js').then(m => m.default()),
  '/family':         () => import('./views/family.js').then(m => m.default()),
  '/expenses':       () => import('./views/expenses.js').then(m => m.default()),
};

/** Paths that hide the bottom nav-bar */
const NAV_HIDDEN = ['/welcome', '/onboarding', '/confirmation'];

/** Strip base path from pathname to get app-level route */
function getAppPath() {
  let p = window.location.pathname;
  if (p.startsWith(BASE_PATH)) p = p.slice(BASE_PATH.length);
  if (!p || p === '') p = '/';
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

/** Build full URL for pushState */
function fullPath(appPath) {
  if (appPath === '/') return BASE_PATH + '/';
  return BASE_PATH + appPath;
}

export const router = {
  currentPath: null,
  container: null,
  _splashed: false,

  init(containerId) {
    this.container = document.getElementById(containerId);

    document.body.addEventListener('click', e => {
      const link = e.target.closest('[data-link]');
      if (link) { e.preventDefault(); this.navigate(link.getAttribute('href')); }
    });

    window.addEventListener('popstate', () => this.route());
    this.route();
  },

  async navigate(path) {
    if (path === this.currentPath) return;
    window.history.pushState(null, null, fullPath(path));
    await this.route();
  },

  /** Resolve a loader for the requested app path (supports mini-world sub-sections) */
  _resolve(path) {
    if (path.startsWith('/mini-world/')) {
      const section = path.slice('/mini-world/'.length);
      return () => import('./views/mini-world.js').then(m => m.default(section));
    }
    return routes[path] || routes['/'];
  },

  async route() {
    // ── Splash: show once per page load ──
    if (!this._splashed) {
      this._splashed = true;
      try {
        const el = await import('./views/splash.js').then(m => m.default());
        this.container.innerHTML = '';
        this.container.appendChild(el);
        const nav = document.querySelector('nav-bar');
        if (nav) nav.style.display = 'none';
        setTimeout(() => this.route(), 2500);
        return;
      } catch (e) { /* fall through to normal routing */ }
    }

    let path = getAppPath();

    // Auth guard
    if (!store.state.isAuthenticated && path !== '/welcome'
        && path !== '/privacy-policy' && path !== '/terms') {
      window.history.replaceState(null, null, fullPath('/welcome'));
      path = '/welcome';
    }

    // Onboarding guard
    if (store.state.isAuthenticated && !store.state.isOnboarded
        && path !== '/onboarding' && path !== '/welcome'
        && path !== '/privacy-policy' && path !== '/terms') {
      window.history.replaceState(null, null, fullPath('/onboarding'));
      path = '/onboarding';
    }

    // Already in → skip welcome/onboarding
    if (store.state.isAuthenticated && store.state.isOnboarded
        && (path === '/welcome' || path === '/onboarding')) {
      window.history.replaceState(null, null, fullPath('/'));
      path = '/';
    }

    const loader = this._resolve(path);
    this.currentPath = path;

    // Animate out
    const old = this.container.firstElementChild;
    if (old) {
      old.classList.add('slide-out-left');
      await new Promise(r => setTimeout(r, 200));
    }

    try {
      const el = await loader();
      this.container.innerHTML = '';
      el.classList.add('slide-in-right');
      this.container.appendChild(el);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Route error:', err);
      this.container.innerHTML = `<div class="empty-state"><p class="empty-state__title">Vaya, algo se torció</p><p class="text-small text-muted">${err.message}</p><button class="btn btn-primary" onclick="location.reload()">Reload</button></div>`;
    }

    window.dispatchEvent(new CustomEvent('viewchange', { detail: { path } }));

    // Toggle nav-bar visibility
    const nav = document.querySelector('nav-bar');
    if (nav) {
      const hide = NAV_HIDDEN.includes(path);
      nav.style.display = hide ? 'none' : '';
    }
  }
};
