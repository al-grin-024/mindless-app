/**
 * Mindless — Settings View
 * User profile, grouped settings items, sign out, and version.
 */
import { store } from '../store.js';
import { t } from '../i18n.js';
import { auth } from '../auth.js';
import { router } from '../router.js';

export default async function render() {
  const el = document.createElement('div');

  const user = store.state.user;
  const name = user?.name || 'User';
  const email = user?.email || '';
  const photoUrl = user?.photoUrl || '';
  const initials = name.split(' ').map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('');

  const chevronSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  el.innerHTML = `
    <div class="header">
      <div class="header__left"></div>
      <h1 class="header__title">${t('settings.title')}</h1>
      <div class="header__right"></div>
    </div>

    <!-- Profile -->
    <div class="settings__profile fade-in-up">
      ${photoUrl
        ? `<div class="avatar avatar-xl"><img src="${photoUrl}" alt="${name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;"></div>`
        : `<div class="avatar avatar-xl">${initials}</div>`
      }
      <h2 class="settings__profile-name">${name}</h2>
      <p class="settings__profile-email">${email}</p>
    </div>

    <!-- Appearance -->
    <div class="settings__group fade-in-up fade-in-up-1">
      <p class="settings__group-title">${t('settings.colorPalette')}</p>
      <div class="settings__item" id="setting-colors">
        <div class="settings__item-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="21.17" y1="8" x2="12" y2="8"/>
            <line x1="3.95" y1="6.06" x2="8.54" y2="14"/>
            <line x1="10.88" y1="21.94" x2="15.46" y2="14"/>
          </svg>
        </div>
        <div class="settings__item-content">
          <p class="settings__item-title">${t('settings.colorPalette')}</p>
          <p class="settings__item-subtitle">${t('onboarding.step6_colorsSubtitle')}</p>
        </div>
        <div class="settings__item-arrow">${chevronSvg}</div>
      </div>
    </div>

    <!-- Categories -->
    <div class="settings__group fade-in-up fade-in-up-2">
      <p class="settings__group-title">${t('settings.categories')}</p>
      <div class="settings__item" id="setting-categories">
        <div class="settings__item-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <div class="settings__item-content">
          <p class="settings__item-title">${t('settings.categories')}</p>
          <p class="settings__item-subtitle">${store.state.categories.length} categories</p>
        </div>
        <div class="settings__item-arrow">${chevronSvg}</div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="settings__group fade-in-up fade-in-up-3">
      <p class="settings__group-title">${t('settings.notifications')}</p>
      <div class="settings__item" id="setting-notifications">
        <div class="settings__item-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div class="settings__item-content">
          <p class="settings__item-title">${t('settings.notifications')}</p>
        </div>
        <div class="settings__item-arrow">${chevronSvg}</div>
      </div>
    </div>

    <!-- Connected accounts -->
    <div class="settings__group fade-in-up fade-in-up-4">
      <p class="settings__group-title">${t('settings.connectedAccounts')}</p>
      <div class="settings__item">
        <div class="settings__item-icon">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.97 23.97 0 0 0 0 24c0 3.77.9 7.35 2.56 10.52l7.97-5.93z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.93C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        </div>
        <div class="settings__item-content">
          <p class="settings__item-title">Google</p>
          <p class="settings__item-subtitle">${email}</p>
        </div>
        <span class="pill pill-success">${t('app.done')}</span>
      </div>

      ${store.state.partner ? `
        <div class="settings__item" id="setting-partner">
          <div class="settings__item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="settings__item-content">
            <p class="settings__item-title">${t('settings.partner')}</p>
            <p class="settings__item-subtitle">${store.state.partner.name || store.state.partner.email || ''}</p>
          </div>
          <div class="settings__item-arrow">${chevronSvg}</div>
        </div>
      ` : `
        <div class="settings__item" id="setting-invite-partner">
          <div class="settings__item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <div class="settings__item-content">
            <p class="settings__item-title">${t('settings.invitePartner')}</p>
          </div>
          <div class="settings__item-arrow">${chevronSvg}</div>
        </div>
      `}
    </div>

    <!-- Sign out -->
    <div class="px-5 mt-6 fade-in-up fade-in-up-5">
      <button class="btn btn-secondary btn-block" id="sign-out-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        ${t('settings.signOut')}
      </button>
    </div>

    <!-- Version -->
    <div class="settings__version fade-in-up fade-in-up-6">
      ${t('settings.version', { version: '1.0.0' })}
    </div>
  `;

  // ── Event handlers ──
  el.querySelector('#sign-out-btn')?.addEventListener('click', async () => {
    await auth.signOut();
  });

  return el;
}
