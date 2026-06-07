/**
 * Mindless — Confirmation ("Done." payoff)
 * Full-screen, no nav. Blobs slowly dissolve. Auto-returns home after 3.5s.
 */
import { router } from '../router.js';
import { blobField } from '../components/gradient-blob.js';

export default async function render() {
  const el = document.createElement('div');
  el.className = 'confirm';
  el.appendChild(blobField('confirm'));

  const inner = document.createElement('div');
  inner.className = 'confirm__inner';
  inner.innerHTML = `
    <div class="confirm__done">Done.</div>
    <div class="confirm__line1">It's out of your head.</div>
    <div class="confirm__line2">Enjoy.</div>
  `;
  el.appendChild(inner);

  const back = document.createElement('button');
  back.className = 'confirm__back';
  back.textContent = 'Volver a casa';
  back.addEventListener('click', () => router.navigate('/'));
  el.appendChild(back);

  const timer = setTimeout(() => router.navigate('/'), 3500);
  back.addEventListener('click', () => clearTimeout(timer));

  return el;
}
