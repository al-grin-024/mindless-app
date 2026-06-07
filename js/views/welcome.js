/**
 * Mindless — Welcome
 * Cream bg with large blobs, white content card, 4 colored feature cards,
 * black "Continue with Google" pill, and legal footer links.
 */
import { auth } from '../auth.js';
import { router } from '../router.js';
import { blobField } from '../components/gradient-blob.js';

const G_LOGO = `<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;

const FEATURES = [
  { bg: 'var(--cat-blue)',  icon: 'ph-envelope-simple', text: "I'll read your emails so you don't have to." },
  { bg: 'var(--cat-peach)', icon: 'ph-bell',            text: "I'll create reminders before you forget." },
  { bg: 'var(--cat-mint)',  icon: 'ph-calendar-dots',   text: "I'll organize your family's schedule." },
  { bg: 'var(--cat-lilac)', icon: 'ph-shield-check',    text: "I'll never do anything without asking first." },
];

export default async function render() {
  const el = document.createElement('div');
  el.appendChild(blobField('welcome'));

  const wrap = document.createElement('div');
  wrap.className = 'welcome';
  wrap.innerHTML = `
    <div class="welcome__card">
      <div class="welcome__title">Mindless</div>
      <div class="welcome__sub">Your family's second brain</div>

      <div class="feature-list">
        ${FEATURES.map(f => `
          <div class="feature" style="background:${f.bg}">
            <div class="feature__icon"><i class="ph ${f.icon}"></i></div>
            <div class="feature__text">${f.text}</div>
          </div>`).join('')}
      </div>

      <button class="btn btn-google btn-block btn-lg" id="google-btn">
        <span class="g-logo">${G_LOGO}</span>
        <span>Continue with Google</span>
      </button>

      <div class="welcome__footer">
        By continuing you agree to our
        <a href="/terms" data-link>Terms</a> and
        <a href="/privacy-policy" data-link>Privacy Policy</a>.
      </div>
    </div>
  `;
  el.appendChild(wrap);

  wrap.querySelector('#google-btn').addEventListener('click', () => auth.handleGoogleClick());
  return el;
}
