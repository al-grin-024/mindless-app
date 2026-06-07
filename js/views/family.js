/**
 * Mindless — Familia (reached from Tu mini mundo)
 * Family members as colored cards. Add member via a small prompt.
 */
import { store } from '../store.js';
import { blobField } from '../components/gradient-blob.js';

const COLORS = ['var(--cat-teal)', 'var(--cat-peach)', 'var(--cat-blue)', 'var(--cat-lilac)', 'var(--cat-rose)', 'var(--cat-mint)'];

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';
  view.innerHTML = `
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Familia</span>
    </div>
    <div class="family-list" id="fam-list"></div>
    <button class="btn btn-secondary btn-block mt-6" id="add-member">
      <i class="ph ph-user-plus"></i> Añadir a alguien
    </button>
  `;
  el.appendChild(view);

  const list = view.querySelector('#fam-list');

  function draw() {
    list.innerHTML = '';
    const members = store.state.familyMembers;
    if (!members.length) {
      list.innerHTML = `<div class="empty-state">
        <i class="ph-duotone ph-users-three empty-state__icon"></i>
        <p class="empty-state__title">Tu familia, en un sitio</p>
        <p class="text-small text-muted">Añade a tu pareja y a los peques.</p></div>`;
      return;
    }
    list.classList.add('stagger');
    members.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'family-card';
      card.style.background = COLORS[i % COLORS.length];
      const initial = (m.name || '?')[0].toUpperCase();
      card.innerHTML = `
        <div class="avatar-fallback family-card__avatar" style="background:rgba(255,255,255,0.55)">${m.emoji || initial}</div>
        <div class="flex-1">
          <div class="family-card__name">${escapeHtml(m.name)}</div>
          <div class="family-card__role">${escapeHtml(m.role || 'Familia')}</div>
        </div>`;
      list.appendChild(card);
    });
  }
  draw();

  view.querySelector('#add-member').addEventListener('click', async () => {
    const name = prompt('¿Cómo se llama?');
    if (!name) return;
    const role = prompt('¿Quién es? (Pareja, Peque, Abuela...)') || 'Familia';
    await store.addFamilyMember({ name: name.trim(), role: role.trim(), emoji: '' });
    draw();
  });

  return el;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
