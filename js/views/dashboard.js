/**
 * Mindless — Dashboard (Home)
 * Greeting + avatar, a week strip with today highlighted, and today's tasks.
 */
import { store } from '../store.js';
import { router } from '../router.js';
import { taskCard } from '../components/task-card.js';
import { blobField } from '../components/gradient-blob.js';
import { openTellMe } from './tell-me.js';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function greetingWord() {
  const h = new Date().getHours();
  if (h < 6) return 'Buenas noches';
  if (h < 14) return 'Buenos días';
  if (h < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

function startOfWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Mon=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isSameDay(a, b) {
  const x = new Date(a), y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';

  const user = store.state.user || {};
  const firstName = user.givenName || (user.name || '').split(' ')[0] || '';
  const avatar = user.photoUrl
    ? `<img class="dash-avatar" src="${user.photoUrl}" alt="${firstName}" referrerpolicy="no-referrer">`
    : `<div class="dash-avatar avatar-fallback">${(firstName[0] || 'M').toUpperCase()}</div>`;

  // Week strip
  const today = new Date();
  const weekStart = startOfWeek(today);
  let weekHtml = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const todayCls = isSameDay(d, today) ? ' is-today' : '';
    weekHtml += `
      <div class="week-day${todayCls}">
        <span class="week-day__name">${DAYS[i]}</span>
        <span class="week-day__num">${d.getDate()}</span>
      </div>`;
  }

  view.innerHTML = `
    <div class="dash-header">
      <div>
        <div class="dash-greeting">${greetingWord()},<br>${escapeHtml(firstName) || 'guapa'} 👋</div>
        <div class="dash-subgreeting">Esto es lo de hoy. Yo me encargo del resto.</div>
      </div>
      <button data-link href="/profile" aria-label="Perfil" style="background:none">${avatar}</button>
    </div>
    <div class="week-strip">${weekHtml}</div>
    <div class="section-title">Hoy</div>
    <div class="task-list" id="dash-tasks"></div>
  `;
  el.appendChild(view);

  // Today's tasks
  const list = view.querySelector('#dash-tasks');
  const todays = store.state.tasks
    .filter(t => !t.dueDate || isSameDay(t.dueDate, today))
    .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));

  if (!todays.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `
      <i class="ph-duotone ph-cloud-sun empty-state__icon"></i>
      <p class="empty-state__title">Hoy estás libre de líos</p>
      <p class="text-small text-muted">Cuéntame algo y yo lo organizo por ti.</p>
    `;
    const cta = document.createElement('button');
    cta.className = 'btn btn-primary';
    cta.innerHTML = `<i class="ph ph-microphone"></i> Cuéntame`;
    cta.addEventListener('click', () => openTellMe());
    empty.appendChild(cta);
    list.appendChild(empty);
  } else {
    list.classList.add('stagger');
    todays.forEach(t => list.appendChild(taskCard(t, {
      onClick: () => router.navigate('/tasks'),
    })));
  }

  return el;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
