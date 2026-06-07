/**
 * Mindless — Splash (≈2.5s)
 * Cream background, drifting blobs, the name and tagline fade in.
 * The router auto-advances after 2.5s to /welcome or /.
 */
import { blobField } from '../components/gradient-blob.js';

export default async function render() {
  const el = document.createElement('div');
  el.className = 'splash';
  el.appendChild(blobField('default'));

  const content = document.createElement('div');
  content.style.cssText = 'position:relative;z-index:1;text-align:center;';
  content.innerHTML = `
    <div class="splash__title">Mindless</div>
    <div class="splash__sub">Your family's second brain</div>
  `;
  el.appendChild(content);
  return el;
}
