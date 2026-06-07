/**
 * Mindless — Google Identity Services Auth
 */
import { store } from './store.js';
import { router } from './router.js';

export const auth = {
  clientId: '184275451301-5j76u3kc6b02kraehukuol725suue30p.apps.googleusercontent.com',
  _initialized: false,

  init() {
    if (typeof google === 'undefined' || !google.accounts) {
      // GIS not yet loaded — wait for it
      window.addEventListener('load', () => { if (typeof google !== 'undefined') this._setup(); });
      return;
    }
    this._setup();
  },

  _setup() {
    if (this._initialized) return;
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (resp) => this._onCredential(resp),
      auto_select: false,
    });
    this._initialized = true;
  },

  /** Called from the welcome view's button */
  handleGoogleClick() {
    if (typeof google === 'undefined' || !google.accounts) {
      alert('Google Sign-In is still loading. Please wait a moment.');
      return;
    }
    if (!this._initialized) this._setup();
    google.accounts.id.prompt((notification) => {
      // One Tap couldn't show (already signed in, cooldown, FedCM blocked…).
      // Show a proper, DISMISSIBLE modal instead of leaking a floating button.
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        this._showFallback();
      }
    });
  },

  /** Managed sign-in modal (backdrop + close). Cleaned up on credential/close. */
  _showFallback() {
    this._removeFallback();

    const backdrop = document.createElement('div');
    backdrop.className = 'sheet-backdrop';

    const card = document.createElement('div');
    card.setAttribute('role', 'dialog');
    card.style.cssText =
      'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;' +
      'background:#fff;border-radius:24px;padding:28px 24px;width:min(90vw,340px);' +
      'box-shadow:0 14px 44px rgba(0,0,0,.25);text-align:center';
    card.innerHTML = `
      <button id="gsi-close" aria-label="Cerrar" style="position:absolute;top:10px;right:14px;font-size:1.6rem;line-height:1;color:#999;background:none;border:none;cursor:pointer">&times;</button>
      <div style="font-weight:800;font-size:1.15rem;color:#2D2D2D;margin-bottom:6px">Entra con Google</div>
      <div style="font-size:.9rem;color:#888;margin-bottom:18px">Elige tu cuenta para continuar.</div>
      <div id="gsi-btn" style="display:flex;justify-content:center"></div>`;

    document.body.appendChild(backdrop);
    document.body.appendChild(card);
    this._fallbackEls = [backdrop, card];

    google.accounts.id.renderButton(card.querySelector('#gsi-btn'),
      { theme: 'filled_black', size: 'large', shape: 'pill', text: 'continue_with', width: 280 });

    const close = () => this._removeFallback();
    backdrop.addEventListener('click', close);
    card.querySelector('#gsi-close').addEventListener('click', close);
  },

  _removeFallback() {
    (this._fallbackEls || []).forEach(el => el.remove());
    this._fallbackEls = null;
  },

  _onCredential(response) {
    try {
      this._removeFallback(); // tear down the sign-in modal if it was showing
      const payload = this._decodeJwt(response.credential);
      const user = {
        id: payload.sub,
        name: payload.name,
        givenName: payload.given_name,
        email: payload.email,
        photoUrl: payload.picture,
        token: response.credential
      };
      localStorage.setItem('mindless_user', JSON.stringify(user));
      store.state.user = user;
      store.state.isAuthenticated = true;
      router.navigate(store.state.isOnboarded ? '/' : '/onboarding');
    } catch (e) {
      console.error('Auth error:', e);
    }
  },

  _decodeJwt(token) {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')));
  },

  async signOut() {
    if (typeof google !== 'undefined') google.accounts.id.disableAutoSelect();
    await store.logout();
    router.navigate('/welcome');
  }
};
