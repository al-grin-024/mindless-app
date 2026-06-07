/**
 * Mindless — <nav-bar> Web Component
 * Three tabs only:
 *   left   → Tu mini mundo (/mini-world)
 *   center → Cuéntame (raised mic, opens the tell-me bottom sheet)
 *   right  → Profile (/profile) — shows the user's Google avatar
 * Active state updates on the 'viewchange' CustomEvent from the router.
 */
import { router } from '../router.js';
import { store } from '../store.js';
import { openTellMe } from '../views/tell-me.js';

class NavBar extends HTMLElement {
  constructor() {
    super();
    this._onViewChange = this._onViewChange.bind(this);
  }

  connectedCallback() {
    this._render();
    window.addEventListener('viewchange', this._onViewChange);
    this._unsub = store.subscribe('user', () => this._render());
  }

  disconnectedCallback() {
    window.removeEventListener('viewchange', this._onViewChange);
    if (this._unsub) this._unsub();
  }

  _avatarHtml() {
    const u = store.state.user;
    if (u && u.photoUrl) {
      return `<img class="nav-avatar" src="${u.photoUrl}" alt="${u.name || 'Perfil'}" referrerpolicy="no-referrer">`;
    }
    return `<i class="ph ph-user-circle"></i>`;
  }

  _render() {
    this.innerHTML = `
      <div class="navbar">
        <div class="navbar__inner">
          <button class="nav-item nav-item--left" data-nav="/mini-world" aria-label="Tu mini mundo">
            <i class="ph ph-globe"></i>
            <span class="nav-item__label">Tu mini mundo</span>
          </button>

          <div class="nav-mic">
            <button class="nav-mic__btn" id="nav-mic-btn" aria-label="Cuéntame">
              <i class="ph ph-microphone"></i>
            </button>
            <span class="nav-mic__label">Cuéntame</span>
          </div>

          <button class="nav-item nav-item--right" data-nav="/profile" aria-label="Perfil">
            ${this._avatarHtml()}
            <span class="nav-item__label">Perfil</span>
          </button>
        </div>
      </div>
    `;

    this.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', () => router.navigate(btn.getAttribute('data-nav')));
    });
    this.querySelector('#nav-mic-btn').addEventListener('click', () => openTellMe());

    this._applyActive(router.currentPath || window.location.pathname);
  }

  _applyActive(path) {
    const left = this.querySelector('.nav-item--left');
    const right = this.querySelector('.nav-item--right');
    if (!left || !right) return;
    left.classList.toggle('is-active', path.startsWith('/mini-world')
      || ['/calendar', '/tasks', '/family', '/expenses'].includes(path));
    right.classList.toggle('is-active', path === '/profile'
      || path === '/privacy-policy' || path === '/terms');
  }

  _onViewChange(e) {
    this._applyActive(e.detail?.path || '/');
  }
}

customElements.define('nav-bar', NavBar);
