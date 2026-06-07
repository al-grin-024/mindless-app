/**
 * Mindless — Invitar a tu pareja
 * The partner does NOT log in on your device (that would overwrite your
 * account). Instead you send them an invitation: email, shareable link, or
 * the native share sheet. The pending invite is saved in settings.
 */
import { store } from '../store.js';

let _open = false;

/** Build a shareable invite URL pointing at this Mindless install. */
function inviteLink() {
  const base = location.origin + location.pathname.replace(/[^/]*$/, '');
  let token = store.state.settings.partnerInviteToken;
  if (!token) {
    token = (crypto.randomUUID && crypto.randomUUID().slice(0, 8)) || Math.random().toString(36).slice(2, 10);
    store.updateSetting('partnerInviteToken', token).catch(() => {});
  }
  return base + '?invite=' + token;
}

export function openInvitePartner() {
  if (_open) return;
  _open = true;

  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';

  const sheet = document.createElement('div');
  sheet.className = 'sheet';

  const existing = store.state.settings.partnerInvite;
  const inviterName = store.state.user?.givenName || store.state.user?.name || 'tu pareja';
  const link = inviteLink();

  sheet.innerHTML = `
    <div class="sheet__handle"></div>
    <div class="sheet__title">Invita a tu pareja</div>
    <div class="sheet__hint">Mindless va mejor en equipo. Mándale una invitación y repartís el lío de casa. 💛</div>

    <label class="field-label">Su email</label>
    <input class="field" id="inv-email" type="email" inputmode="email" autocomplete="email"
           placeholder="pareja@email.com" value="${existing?.email || ''}">

    <button class="btn btn-primary btn-block mt-4" id="inv-send">
      <i class="ph ph-paper-plane-tilt"></i> Enviar invitación
    </button>
    <button class="btn btn-ghost btn-block mt-2" id="inv-copy">
      <i class="ph ph-link-simple"></i> Copiar enlace
    </button>
    ${navigator.share ? `<button class="btn btn-ghost btn-block mt-2" id="inv-share"><i class="ph ph-share-network"></i> Compartir</button>` : ''}

    <div id="inv-status" class="text-small text-center mt-4"></div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  const emailInput = sheet.querySelector('#inv-email');
  const status = sheet.querySelector('#inv-status');

  function setStatus(msg, ok = true) {
    status.textContent = msg;
    status.style.color = ok ? 'var(--cat-mint-ink)' : 'var(--cat-rose-ink)';
  }

  function savePending(email) {
    store.updateSetting('partnerInvite', { email: email || '', status: 'pending', sentAt: Date.now() }).catch(() => {});
  }

  function close() {
    if (!_open) return;
    _open = false;
    sheet.classList.add('is-closing');
    backdrop.classList.add('is-closing');
    setTimeout(() => { sheet.remove(); backdrop.remove(); }, 280);
  }

  const message = `¡Hola! Te invito a organizar nuestra casa conmigo en Mindless, ` +
    `nuestro segundo cerebro para no olvidarnos de nada. Únete aquí: ${link} — ${inviterName} 💛`;

  sheet.querySelector('#inv-send').addEventListener('click', () => {
    const email = (emailInput.value || '').trim();
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('Ese email no tiene buena pinta 🤔', false);
      return;
    }
    savePending(email);
    const subject = encodeURIComponent('Te invito a Mindless 💛');
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus('Invitación preparada en tu correo ✉️');
    setTimeout(close, 1200);
  });

  sheet.querySelector('#inv-copy').addEventListener('click', async () => {
    savePending((emailInput.value || '').trim());
    try {
      await navigator.clipboard.writeText(link);
      setStatus('Enlace copiado. ¡Pégaselo donde quieras! 🔗');
    } catch {
      setStatus(link, true);
    }
  });

  const shareBtn = sheet.querySelector('#inv-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      savePending((emailInput.value || '').trim());
      try {
        await navigator.share({ title: 'Mindless', text: message, url: link });
        setStatus('¡Compartido! 💛');
      } catch { /* user cancelled */ }
    });
  }

  backdrop.addEventListener('click', close);
}
