/**
 * Mindless — Tu mini mundo
 * Hub: a 2×4 grid of pastel section cards (cohesive Phosphor duotone icons).
 * Sub-views: render with a back arrow and section content.
 * default(section) — no section → hub; section → that sub-view.
 */
import { store } from '../store.js';
import { router } from '../router.js';
import { taskCard } from '../components/task-card.js';
import { blobField } from '../components/gradient-blob.js';
import { openTellMe } from './tell-me.js';

/** The 8 hub cards. route: where the card navigates. */
const CARDS = [
  { id: 'food',     label: 'Comida', icon: 'ph-cooking-pot',    bg: 'var(--cat-peach)',  route: '/mini-world/food' },
  { id: 'medical',  label: 'Salud',  icon: 'ph-heartbeat',      bg: 'var(--cat-mint)',   route: '/mini-world/medical' },
  { id: 'school',   label: 'Cole',   icon: 'ph-backpack',       bg: 'var(--cat-blue)',   route: '/mini-world/school' },
  { id: 'expenses', label: 'Gastos', icon: 'ph-piggy-bank',     bg: 'var(--cat-yellow)', route: '/expenses' },
  { id: 'social',   label: 'Social', icon: 'ph-gift',           bg: 'var(--cat-lilac)',  route: '/mini-world/social' },
  { id: 'calendar', label: 'Agenda', icon: 'ph-calendar-dots',  bg: 'var(--cat-pink)',   route: '/calendar' },
  { id: 'family',   label: 'Familia',icon: 'ph-users-three',    bg: 'var(--cat-teal)',   route: '/family' },
  { id: 'spark',    label: 'Chispa', icon: 'ph-heart-straight', bg: 'var(--cat-rose)',   route: '/mini-world/spark' },
];

/** Copy + category mapping for the inline sub-views. */
const SECTIONS = {
  food:    { label: 'Comida', icon: 'ph-cooking-pot',    bg: 'var(--cat-peach)', cat: 'food',
             intro: 'Planifico el menú, la lista de la compra y hasta la merienda. Tú solo decide qué te apetece.' },
  medical: { label: 'Salud',  icon: 'ph-heartbeat',      bg: 'var(--cat-mint)',  cat: 'health',
             intro: 'Vacunas, revisiones y la pediatra del centro de salud. Te aviso antes de que se te pase.' },
  school:  { label: 'Cole',   icon: 'ph-backpack',       bg: 'var(--cat-blue)',  cat: 'school',
             intro: 'Leo los correos del AMPA y del cole para que no se te escape ninguna excursión ni disfraz.' },
  social:  { label: 'Social', icon: 'ph-gift',           bg: 'var(--cat-lilac)', cat: 'social',
             intro: 'Cumpleaños, regalos y compromisos. Te recuerdo a quién felicitar y qué llevar.' },
  spark:   { label: 'Chispa', icon: 'ph-heart-straight', bg: 'var(--cat-rose)',  cat: 'spark',
             intro: 'Vuestro rinconcito de pareja: planes, detalles y tiempo para vosotros dos.' },
};

export default async function render(section) {
  if (section && SECTIONS[section]) return renderSection(section);
  return renderHub();
}

function renderHub() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';
  view.innerHTML = `
    <div class="view-header" style="margin-left:0">
      <h1 class="view-header__title" style="font-size:1.75rem">Tu mini mundo</h1>
    </div>
    <p class="text-small text-muted mb-4" style="margin-top:-12px">Todo lo de casa, ordenadito por rincones.</p>
    <div class="miniworld-grid stagger" id="mw-grid"></div>
  `;
  el.appendChild(view);

  const grid = view.querySelector('#mw-grid');
  CARDS.forEach(c => {
    const card = document.createElement('button');
    card.className = 'miniworld-card';
    card.style.background = c.bg;
    card.innerHTML = `
      <i class="ph-duotone ${c.icon} miniworld-card__icon"></i>
      <span class="miniworld-card__label">${c.label}</span>`;
    card.addEventListener('click', () => router.navigate(c.route));
    grid.appendChild(card);
  });

  return el;
}

function renderSection(id) {
  const s = SECTIONS[id];
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';
  view.innerHTML = `
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">${s.label}</span>
    </div>
    <div class="section-intro" style="background:${s.bg}">
      <i class="ph-duotone ${s.icon} section-intro__icon"></i>
      <div class="section-intro__text">${s.intro}</div>
    </div>
    <div class="section-title">Pendiente</div>
    <div class="task-list" id="mw-tasks"></div>
  `;
  el.appendChild(view);

  const list = view.querySelector('#mw-tasks');
  const items = store.state.tasks.filter(t => t.categoryId === s.cat);

  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <i class="ph-duotone ${s.icon} empty-state__icon"></i>
      <p class="empty-state__title">Aquí no hay líos todavía</p>
      <p class="text-small text-muted">Cuéntame y lo guardo en ${s.label}.</p>`;
    const cta = document.createElement('button');
    cta.className = 'btn btn-primary';
    cta.innerHTML = `<i class="ph ph-microphone"></i> Cuéntame`;
    cta.addEventListener('click', () => openTellMe());
    empty.appendChild(cta);
    list.appendChild(empty);
  } else {
    list.classList.add('stagger');
    items.forEach(t => list.appendChild(taskCard(t)));
  }

  return el;
}
