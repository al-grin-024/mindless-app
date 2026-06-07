/**
 * GoogleButton – Styled Google Sign-In button
 * Renders the branded "Continue with Google" button
 * Triggers auth flow on click
 */

import { t } from '../i18n.js';
import { auth } from '../auth.js';

/**
 * Create a Google Sign-In button
 * @param {Object} [options]
 * @param {Function} [options.onSuccess] - Callback after successful sign-in
 * @param {Function} [options.onError] - Callback on sign-in failure
 * @returns {HTMLElement}
 */
export function GoogleButton({ onSuccess, onError } = {}) {
  const btn = document.createElement('button');
  btn.id = 'google-sign-in-btn';
  btn.className = 'btn btn-google';
  btn.type = 'button';
  btn.setAttribute('aria-label', t('auth.continueWithGoogle'));

  btn.innerHTML = `
    <svg class="google-icon" width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.97 23.97 0 0 0 0 24c0 3.77.9 7.35 2.56 10.52l7.97-5.93z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.93C6.51 42.62 14.62 48 24 48z"/>
    </svg>
    <span>${t('auth.continueWithGoogle')}</span>
  `;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.classList.add('btn--loading');

    try {
      const user = await auth.signIn();
      if (onSuccess) onSuccess(user);
    } catch (err) {
      console.error('[GoogleButton] Sign-in failed:', err);
      if (onError) onError(err);
    } finally {
      btn.disabled = false;
      btn.classList.remove('btn--loading');
    }
  });

  return btn;
}
