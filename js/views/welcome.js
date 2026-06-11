/**
 * Mindless — Welcome
 * Cream bg with large blobs, white content card, 4 colored feature cards,
 * black "Continue with Google" pill, and legal footer links.
 */
import { auth } from '../auth.js';
import { blobField } from '../components/gradient-blob.js';

const G_LOGO = `<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
const PASSWORD_RULE = 'Use at least 8 characters, including uppercase, lowercase, 2 numbers and 2 symbols.';

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

      <div class="welcome-auth-toggle" role="tablist" aria-label="Authentication mode">
        <button class="welcome-auth-toggle__btn is-active" type="button" data-auth-mode="signin">Sign in</button>
        <button class="welcome-auth-toggle__btn" type="button" data-auth-mode="signup">Create account</button>
      </div>

      <form class="welcome-form" id="email-auth-form">
        <div class="welcome-form__row welcome-form__row--name" hidden>
          <label class="field-label" for="name">Name</label>
          <input class="field" id="name" name="name" type="text" autocomplete="name" placeholder="Alex">
        </div>

        <div class="welcome-form__row">
          <label class="field-label" for="email">Email</label>
          <input class="field" id="email" name="email" type="email" autocomplete="email" placeholder="you@family.com" required>
        </div>

        <div class="welcome-form__row">
          <label class="field-label" for="password">Password</label>
          <input class="field" id="password" name="password" type="password" autocomplete="current-password" placeholder="Aa12!!xx" required minlength="8">
        </div>

        <div class="welcome-password-hint" id="password-hint" hidden>
          ${PASSWORD_RULE}
        </div>

        <div class="welcome-form__row welcome-form__row--confirm" hidden>
          <label class="field-label" for="confirm-password">Confirm password</label>
          <input class="field" id="confirm-password" name="confirmPassword" type="password" autocomplete="new-password" placeholder="Repeat password" minlength="8">
        </div>

        <button class="btn btn-primary btn-block btn-lg" id="email-submit-btn" type="submit">
          Continue with email
        </button>
      </form>

      <div class="welcome-auth-status" id="auth-status" role="status" aria-live="polite"></div>

      <div class="welcome-divider" aria-hidden="true">
        <span>or</span>
      </div>

      <button class="btn btn-google btn-block btn-lg" id="google-btn">
        <span class="g-logo">${G_LOGO}</span>
        <span>Continue with Google</span>
      </button>

      <div class="welcome-note">
        Google sign-in is optional. Google Calendar will be connected later as a separate permission step.
      </div>

      <div class="welcome__footer">
        By continuing you agree to our
        <a href="/terms" data-link>Terms</a> and
        <a href="/privacy-policy" data-link>Privacy Policy</a>.
      </div>
    </div>
  `;
  el.appendChild(wrap);

  const form = wrap.querySelector('#email-auth-form');
  const nameRow = wrap.querySelector('.welcome-form__row--name');
  const confirmRow = wrap.querySelector('.welcome-form__row--confirm');
  const nameField = wrap.querySelector('#name');
  const emailField = wrap.querySelector('#email');
  const passwordField = wrap.querySelector('#password');
  const passwordHint = wrap.querySelector('#password-hint');
  const confirmField = wrap.querySelector('#confirm-password');
  const emailSubmitBtn = wrap.querySelector('#email-submit-btn');
  const googleBtn = wrap.querySelector('#google-btn');
  const status = wrap.querySelector('#auth-status');
  const modeButtons = [...wrap.querySelectorAll('[data-auth-mode]')];
  let authMode = 'signin';

  function setStatus(message = '', kind = '') {
    status.textContent = message;
    status.className = `welcome-auth-status${kind ? ` is-${kind}` : ''}`;
  }

  function clearPasswordFields() {
    passwordField.value = '';
    confirmField.value = '';
  }

  function setMode(nextMode) {
    authMode = nextMode;
    const isSignUp = authMode === 'signup';
    nameRow.hidden = !isSignUp;
    confirmRow.hidden = !isSignUp;
    nameField.required = isSignUp;
    confirmField.required = isSignUp;
    passwordField.autocomplete = isSignUp ? 'new-password' : 'current-password';
    passwordHint.hidden = !isSignUp;
    emailSubmitBtn.textContent = isSignUp ? 'Create account with email' : 'Continue with email';
    modeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.authMode === authMode);
    });
    clearPasswordFields();
    setStatus('');
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.authMode));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('');

    const email = emailField.value.trim();
    const password = passwordField.value;
    const name = nameField.value.trim();
    const confirmPassword = confirmField.value;

    if (authMode === 'signup' && password !== confirmPassword) {
      clearPasswordFields();
      setStatus('Passwords do not match.', 'error');
      return;
    }

    if (authMode === 'signup' && !auth.isStrongPassword(password)) {
      clearPasswordFields();
      setStatus(PASSWORD_RULE, 'error');
      return;
    }

    emailSubmitBtn.disabled = true;
    googleBtn.disabled = true;

    try {
      if (authMode === 'signup') {
        await auth.signUpWithEmail({ name, email, password });
        clearPasswordFields();
        return;
      }

      await auth.signInWithEmail(email, password);
      clearPasswordFields();
    } catch (error) {
      clearPasswordFields();
      if (error?.code === 'auth/invalid-credential') {
        try {
          const methods = await auth.getSignInMethods(email);
          if (methods.includes('google.com')) {
            setStatus('This email already uses Google sign-in. Use the Google button, then we can link email later.', 'error');
            return;
          }
        } catch (lookupError) {
          console.error('Sign-in method lookup failed:', lookupError);
        }
      }

      console.error('Email auth failed:', error);
      setStatus(error?.userMessage || error?.message || 'Authentication failed.', 'error');
    } finally {
      emailSubmitBtn.disabled = false;
      googleBtn.disabled = false;
    }
  });

  wrap.querySelector('#google-btn').addEventListener('click', async () => {
    emailSubmitBtn.disabled = true;
    googleBtn.disabled = true;
    clearPasswordFields();
    setStatus('');

    try {
      await auth.handleGoogleClick();
    } finally {
      emailSubmitBtn.disabled = false;
      googleBtn.disabled = false;
    }
  });

  setMode('signin');
  return el;
}
