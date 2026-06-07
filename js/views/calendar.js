/**
 * Mindless — Calendar (monthly)
 * Reached from Tu mini mundo. Month grid with today highlighted and event dots.
 */
import { store } from '../store.js';
import { taskCard } from '../components/task-card.js';
import { blobField } from '../components/gradient-blob.js';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function sameDay(a, b) {
  const x = new Date(a), y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';

  let cursor = new Date();
  cursor.setDate(1);

  view.innerHTML = `
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Agenda</span>
    </div>
    <div class="card card--flush" style="padding:20px">
      <div class="cal-header">
        <button class="icon-btn" id="prev" aria-label="Mes anterior"><i class="ph ph-caret-left"></i></button>
        <span class="cal-month" id="cal-month"></span>
        <button class="icon-btn" id="next" aria-label="Mes siguiente"><i class="ph ph-caret-right"></i></button>
      </div>
      <div class="cal-grid" id="cal-grid"></div>
    </div>
    <div class="section-title mt-6">Próximos planes</div>
    <div class="task-list" id="cal-events"></div>
  `;
  el.appendChild(view);

  const monthLabel = view.querySelector('#cal-month');
  const grid = view.querySelector('#cal-grid');
  const today = new Date();

  function eventsOn(date) {
    return store.state.events.filter(e => e.date && sameDay(e.date, date));
  }

  function draw() {
    monthLabel.textContent = `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
    grid.innerHTML = DOW.map(d => `<div class="cal-dow">${d}</div>`).join('');

    const firstDow = (new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstDow; i++) {
      grid.insertAdjacentHTML('beforeend', `<div class="cal-cell cal-cell--empty"></div>`);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
      const cls = ['cal-cell'];
      if (sameDay(date, today)) cls.push('is-today');
      if (eventsOn(date).length) cls.push('has-event');
      grid.insertAdjacentHTML('beforeend', `<div class="${cls.join(' ')}">${day}</div>`);
    }
  }

  view.querySelector('#prev').addEventListener('click', () => { cursor.setMonth(cursor.getMonth() - 1); draw(); });
  view.querySelector('#next').addEventListener('click', () => { cursor.setMonth(cursor.getMonth() + 1); draw(); });
  draw();

  // Upcoming events / tasks with a due date
  const list = view.querySelector('#cal-events');
  const upcoming = [...store.state.events.map(e => ({ ...e, title: e.title, dueDate: e.date, categoryId: e.categoryId || 'calendar' })),
                    ...store.state.tasks.filter(t => t.dueDate && t.dueDate >= Date.now() - 86400000)]
    .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0))
    .slice(0, 8);

  if (!upcoming.length) {
    list.innerHTML = `<div class="empty-state">
      <i class="ph-duotone ph-calendar-heart empty-state__icon"></i>
      <p class="empty-state__title">Agenda despejada</p>
      <p class="text-small text-muted">Nada a la vista. Disfrútalo.</p></div>`;
  } else {
    list.classList.add('stagger');
    upcoming.forEach(e => list.appendChild(taskCard(e, { showCheck: false })));
  }

  return el;
}
