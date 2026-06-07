/**
 * Mindless — Profile
 * Avatar, name/email, grouped settings cards, legal links, sign out, footer.
 */
import { store } from '../store.js';
import { router } from '../router.js';
import { auth } from '../auth.js';
import { notifications } from '../notifications.js';
import { blobField } from '../components/gradient-blob.js';
import { openInvitePartner } from './invite-partner.js';

function row({ icon, iconBg, label, value = '', toggle = false, on = false, chev = true, id = '' }) {
  return `
    <div class="settings-row" ${id ? `data-row="${id}"` : ''}>
      <div class="settings-row__icon" style="background:${iconBg}"><i class="ph ${icon}"></i></div>
      <div class="settings-row__label">${label}</div>
      ${value ? `<div class="settings-row__value">${value}</div>` : ''}
      ${toggle ? `<div class="toggle ${on ? 'on' : ''}" data-toggle></div>`
               : (chev ? `<i class="ph ph-caret-right settings-row__chev"></i>` : '')}
    </div>`;
}

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';

  const u = store.state.user || {};
  const name = u.name || 'Tu perfil';
  const email = u.email || '';
  const avatar = u.photoUrl
    ? `<img class="profile-avatar" src="${u.photoUrl}" alt="${name}" referrerpolicy="no-referrer">`
    : `<div class="profile-avatar avatar-fallback profile-avatar-fb">${(name[0] || 'M').toUpperCase()}</div>`;

  const notifOn = Notification && Notification.permission === 'granted';
  const partner = store.state.settings.partnerInvite?.email || store.state.settings.partner?.name || store.state.partner?.name;

  view.innerHTML = `
    <div class="profile-head">
      ${avatar}
      <div class="profile-name">${escapeHtml(name)}</div>
      <div class="profile-email">${escapeHtml(email)}</div>
      <button class="profile-edit" id="edit-btn">Editar</button>
    </div>

    <div class="settings-group">
      <div class="settings-group__label">Cuenta</div>
      <div class="settings-card">
        ${row({ icon: 'ph-translate', iconBg: 'var(--cat-blue)', label: 'Idioma', value: 'Español' })}
        ${row({ icon: 'ph-bell', iconBg: 'var(--cat-peach)', label: 'Notificaciones', toggle: true, on: notifOn, id: 'notif' })}
        ${row({ icon: 'ph-user-plus', iconBg: 'var(--cat-teal)', label: 'Invitar a tu pareja', value: partner ? escapeHtml(partner) : '', id: 'partner' })}
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group__label">Preferencias</div>
      <div class="settings-card">
        ${row({ icon: 'ph-palette', iconBg: 'var(--cat-lilac)', label: 'Colores y tema', id: 'theme' })}
        ${row({ icon: 'ph-cooking-pot', iconBg: 'var(--cat-peach)', label: 'Comida', id: 'food' })}
        ${row({ icon: 'ph-microphone', iconBg: 'var(--cat-rose)', label: 'Voz', id: 'voice' })}
      </div>
    </div>

    <div class="settings-group">
      <div class="settings-group__label">Legal</div>
      <div class="settings-card">
        ${row({ icon: 'ph-lock-simple', iconBg: 'var(--cat-mint)', label: 'Política de privacidad', id: 'privacy' })}
        ${row({ icon: 'ph-scroll', iconBg: 'var(--cat-yellow)', label: 'Términos del servicio', id: 'terms' })}
      </div>
    </div>

    <button class="btn btn-secondary btn-block" id="signout-btn">
      <i class="ph ph-sign-out"></i> Cerrar sesión
    </button>

    <div class="profile-footer">
      Mindless v1.0 — Mindless S.L.<br>
      CIF: ES5318573B
    </div>
  `;
  el.appendChild(view);

  // Wire up
  view.querySelector('#signout-btn').addEventListener('click', () => auth.signOut());
  view.querySelector('#edit-btn').addEventListener('click', () => toast('La edición de perfil llega muy pronto 💛'));

  view.querySelectorAll('[data-row]').forEach(r => {
    const id = r.getAttribute('data-row');
    r.addEventListener('click', async (e) => {
      if (e.target.closest('[data-toggle]')) return; // handled below
      if (id === 'privacy') router.navigate('/privacy-policy');
      else if (id === 'terms') router.navigate('/terms');
      else if (id === 'partner') openInvitePartner();
      else if (id === 'voice') (await import('./tell-me.js')).openTellMe();
      else toast('En camino 🚧');
    });
  });

  const notifToggle = view.querySelector('[data-row="notif"] [data-toggle]');
  if (notifToggle) {
    notifToggle.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (notifToggle.classList.contains('on')) {
        toast('Desactívalas desde los ajustes del navegador.');
        return;
      }
      const ok = await notifications.requestPermission();
      notifToggle.classList.toggle('on', ok);
      toast(ok ? 'Te avisaré de lo importante 🔔' : 'Sin permiso no puedo avisarte 😢');
    });
  }

  return el;
}

function toast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;left:50%;bottom:calc(var(--nav-height) + 24px);transform:translateX(-50%);' +
    'background:#2D2D2D;color:#fff;padding:12px 20px;border-radius:100px;font-size:0.875rem;font-weight:600;' +
    'z-index:200;box-shadow:0 6px 20px rgba(0,0,0,0.25);animation:fadeUp 300ms ease-out both;max-width:90vw;text-align:center';
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation = 'fadeOut 300ms ease-out both'; setTimeout(() => t.remove(), 300); }, 2200);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
