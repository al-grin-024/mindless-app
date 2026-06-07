/**
 * Mindless — Task card factory
 * Full-width, colored task card. Exports taskCard() returning an element.
 */
import { store } from '../store.js';

/** Map a category id to a pastel background + readable label. */
const CATEGORY_STYLE = {
  food:     { bg: 'var(--cat-peach)',  label: 'Comida' },
  health:   { bg: 'var(--cat-mint)',   label: 'Salud' },
  school:   { bg: 'var(--cat-blue)',   label: 'Cole' },
  finance:  { bg: 'var(--cat-yellow)', label: 'Gastos' },
  expenses: { bg: 'var(--cat-yellow)', label: 'Gastos' },
  social:   { bg: 'var(--cat-lilac)',  label: 'Social' },
  calendar: { bg: 'var(--cat-pink)',   label: 'Agenda' },
  family:   { bg: 'var(--cat-teal)',   label: 'Familia' },
  spark:    { bg: 'var(--cat-rose)',   label: 'Chispa' },
  home:     { bg: 'var(--cat-blue)',   label: 'Casa' },
};

export function categoryStyle(id) {
  return CATEGORY_STYLE[id] || { bg: 'var(--cat-blue)', label: 'Tarea' };
}

function fmtTime(ts) {
  if (!ts) return '·';
  const d = new Date(ts);
  if (isNaN(d)) return '·';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * @param {object} task
 * @param {object} [opts] { showCheck=true, onToggle, onClick, showCat=true }
 */
export function taskCard(task, opts = {}) {
  const { showCheck = true, onToggle, onClick, showCat = true } = opts;
  const style = categoryStyle(task.categoryId);
  const done = task.status === 'done';

  const el = document.createElement('div');
  el.className = 'task-card' + (done ? ' is-done' : '');
  el.style.background = style.bg;

  el.innerHTML = `
    <div class="task-card__time">${task.time || fmtTime(task.dueDate)}</div>
    <div class="task-card__body">
      <div class="task-card__title">${escapeHtml(task.title)}</div>
      ${task.assignee || task.meta ? `<div class="task-card__meta">${escapeHtml(task.assignee || task.meta)}</div>` : ''}
    </div>
    ${showCat ? `<span class="task-card__cat">${style.label}</span>` : ''}
    ${showCheck ? `<button class="task-card__check" aria-label="Hecho"><i class="ph ph-check"></i></button>` : ''}
  `;

  if (showCheck) {
    el.querySelector('.task-card__check').addEventListener('click', async (e) => {
      e.stopPropagation();
      const next = done ? 'pending' : 'done';
      el.classList.toggle('is-done', next === 'done');
      await store.updateTask(task.id, { status: next });
      if (onToggle) onToggle(next);
    });
  }
  if (onClick) el.addEventListener('click', () => onClick(task));

  return el;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
