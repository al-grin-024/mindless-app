/**
 * Mindless — Gastos (reached from Tu mini mundo)
 * Monthly total + split summary, then the list of expenses.
 */
import { store } from '../store.js';
import { blobField } from '../components/gradient-blob.js';

const CAT_ICON = {
  food: 'ph-cooking-pot', school: 'ph-backpack', health: 'ph-heartbeat',
  home: 'ph-house', social: 'ph-gift', shopping: 'ph-shopping-bag',
};

function fmtMoney(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n || 0);
}

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('default'));

  const view = document.createElement('div');
  view.className = 'view';

  const now = new Date();
  const monthExpenses = store.state.expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const total = monthExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const split = store.state.settings.financeSplit || '50/50';

  view.innerHTML = `
    <div class="view-header">
      <button class="icon-btn" data-link href="/mini-world" aria-label="Atrás"><i class="ph ph-arrow-left"></i></button>
      <span class="view-header__title">Gastos</span>
    </div>
    <div class="expense-summary">
      <div class="expense-summary__label">Este mes</div>
      <div class="expense-summary__amount">${fmtMoney(total)}</div>
      <div class="expense-summary__split">Repartido ${split} con tu pareja</div>
    </div>
    <div class="section-title">Movimientos</div>
    <div class="expense-list" id="exp-list"></div>
  `;
  el.appendChild(view);

  const list = view.querySelector('#exp-list');
  if (!monthExpenses.length) {
    list.innerHTML = `<div class="empty-state">
      <i class="ph-duotone ph-piggy-bank empty-state__icon"></i>
      <p class="empty-state__title">Sin gastos este mes</p>
      <p class="text-small text-muted">Cuéntame un gasto y lo reparto por ti.</p></div>`;
  } else {
    list.classList.add('stagger');
    monthExpenses
      .sort((a, b) => b.date - a.date)
      .forEach(e => {
        const card = document.createElement('div');
        card.className = 'expense-card';
        card.style.background = 'var(--cat-yellow)';
        const icon = CAT_ICON[e.categoryId] || 'ph-receipt';
        const date = new Date(e.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        card.innerHTML = `
          <div class="expense-card__icon"><i class="ph ${icon}"></i></div>
          <div class="expense-card__body">
            <div class="expense-card__title">${escapeHtml(e.title || 'Gasto')}</div>
            <div class="expense-card__meta">${date}${e.paidBy ? ' · ' + escapeHtml(e.paidBy) : ''}</div>
          </div>
          <div class="expense-card__amount">${fmtMoney(e.amount)}</div>`;
        list.appendChild(card);
      });
  }

  const fab = document.createElement('button');
  fab.className = 'fab';
  fab.setAttribute('aria-label', 'Añadir gasto');
  fab.innerHTML = `<i class="ph ph-plus"></i>`;
  fab.addEventListener('click', async () => {
    const title = prompt('¿Qué gasto?');
    if (!title) return;
    const amount = parseFloat((prompt('¿Cuánto? (€)') || '').replace(',', '.'));
    if (isNaN(amount)) return;
    await store.addExpense({ title: title.trim(), amount, categoryId: 'home', date: Date.now() });
    render().then(fresh => {
      el.replaceWith(fresh);
    });
  });
  el.appendChild(fab);

  return el;
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
