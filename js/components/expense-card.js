import { store } from '../store.js';

class ExpenseCard extends HTMLElement {
  connectedCallback() {
    this.expenseId = this.getAttribute('data-id');
    this.render();
  }

  render() {
    const expense = store.state.expenses.find(e => e.id === this.expenseId);
    if (!expense) return;
    
    const category = store.state.categories.find(c => c.id === expense.categoryId) || { color: '#E5E5E5', icon: '💰' };
    const isMe = expense.paidBy === 'me';
    
    this.innerHTML = \`
      <div class="card p-4 flex items-center gap-4 bg-white border border-[var(--border)]">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg" style="background-color: \${category.color}40; color: \${category.color};">
          \${category.icon}
        </div>
        <div class="flex-1">
          <p class="font-medium text-primary">\${expense.description}</p>
          <p class="text-small text-secondary">\${isMe ? 'You paid' : 'Partner paid'}</p>
        </div>
        <div class="text-right">
          <p class="font-medium text-primary">€\${expense.amount.toFixed(2)}</p>
        </div>
      </div>
    \`;
  }
}
customElements.define('expense-card', ExpenseCard);
