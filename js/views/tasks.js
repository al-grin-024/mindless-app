/**
 * Mindless — Tasks list (reached from Tu mini mundo)
 * All tasks grouped into Pendiente / Hechas. Floating add → Cuéntame.
 */
import { store } from '../store.js';
import { taskCard } from '../components/task-card.js';
import { blobField } from '../components/gradient-blob.js';
import { openTellMe } from './tell-me.js';

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';
  view.innerHTML = `
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Tareas</span>
    </div>
    <div id="pending-wrap"></div>
    <div id="done-wrap"></div>
  `;
  el.appendChild(view);

  const pending = store.state.tasks.filter(t => t.status !== 'done');
  const done = store.state.tasks.filter(t => t.status === 'done');

  const pw = view.querySelector('#pending-wrap');
  if (!pending.length && !done.length) {
    pw.innerHTML = `<div class="empty-state">
      <i class="ph-duotone ph-checks empty-state__icon"></i>
      <p class="empty-state__title">Ni una tarea pendiente</p>
      <p class="text-small text-muted">Cuéntame y la apunto al vuelo.</p></div>`;
  } else {
    pw.innerHTML = `<div class="section-title">Pendiente (${pending.length})</div>`;
    const list = document.createElement('div');
    list.className = 'task-list stagger';
    pending.forEach(t => list.appendChild(taskCard(t)));
    pw.appendChild(list);
  }

  if (done.length) {
    const dw = view.querySelector('#done-wrap');
    dw.innerHTML = `<div class="section-title mt-6">Hechas (${done.length})</div>`;
    const list = document.createElement('div');
    list.className = 'task-list';
    done.forEach(t => list.appendChild(taskCard(t)));
    dw.appendChild(list);
  }

  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.setAttribute('aria-label', 'Añadir');
  fab.innerHTML = `<i class="ph ph-plus"></i>`;
  fab.addEventListener('click', () => openTellMe());
  el.appendChild(fab);

  return el;
}
