/**
 * Mindless — "Cuéntame" bottom sheet overlay
 * A voice/chat input that slides up over the current screen.
 * Captures what the user speaks/types, stores it, and routes to a
 * confirmation payoff. Dismiss by swiping down or tapping the backdrop.
 */
import { voice } from '../voice.js';
import { router } from '../router.js';
import { store } from '../store.js';

const HISTORY_KEY = 'mindless_voice_history';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}
function pushHistory(text) {
  const h = [{ text, at: Date.now() }, ...loadHistory()].slice(0, 6);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

let _open = false;

export function openTellMe() {
  if (_open) return;
  _open = true;

  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';

  const sheet = document.createElement('div');
  sheet.className = 'sheet';

  const history = loadHistory();
  const historyHtml = history.length ? `
    <div class="cmd-history">
      <div class="cmd-history__label">Lo último que me contaste</div>
      ${history.map(h => `<div class="cmd-item"><i class="ph ph-quotes"></i><span>${escapeHtml(h.text)}</span></div>`).join('')}
    </div>` : '';

  sheet.innerHTML = `
    <div class="sheet__handle"></div>
    <div class="sheet__title">Cuéntame</div>
    <div class="sheet__hint">Cuéntame lo que necesites...</div>
    <div class="mic-stage">
      <button class="mic-big" id="tm-mic" aria-label="Hablar"><i class="ph ph-microphone"></i></button>
      <div class="mic-transcript" id="tm-transcript"></div>
    </div>
    <div class="sheet__or">o escríbeme</div>
    <div class="sheet__input-row">
      <input class="field" id="tm-input" type="text" placeholder="O escríbeme aquí..." autocomplete="off">
      <button class="onboarding__send" id="tm-send" aria-label="Enviar"><i class="ph ph-arrow-up"></i></button>
    </div>
    ${historyHtml}
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  const micBtn = sheet.querySelector('#tm-mic');
  const transcript = sheet.querySelector('#tm-transcript');
  const input = sheet.querySelector('#tm-input');
  const send = sheet.querySelector('#tm-send');

  function close() {
    if (!_open) return;
    _open = false;
    voice.stop();
    sheet.classList.add('is-closing');
    backdrop.classList.add('is-closing');
    setTimeout(() => { sheet.remove(); backdrop.remove(); }, 280);
  }

  function submit(text) {
    text = (text || '').trim();
    if (!text) return;
    pushHistory(text);
    // Lightweight capture as a task so it isn't lost.
    store.addTask({
      title: text,
      categoryId: 'home',
      source: 'voice',
      dueDate: Date.now(),
    }).catch(() => {});
    close();
    router.navigate('/confirmation');
  }

  micBtn.addEventListener('click', async () => {
    if (!voice.isSupported) {
      transcript.textContent = 'Tu navegador no soporta voz — escríbeme mejor 💛';
      input.focus();
      return;
    }
    micBtn.classList.add('is-listening');
    transcript.textContent = 'Te escucho...';
    try {
      const result = await voice.listen();
      micBtn.classList.remove('is-listening');
      if (result) {
        transcript.textContent = `"${result}"`;
        setTimeout(() => submit(result), 600);
      } else {
        transcript.textContent = 'No te he pillado, ¿lo repites?';
      }
    } catch (e) {
      micBtn.classList.remove('is-listening');
      transcript.textContent = e.message === 'not-allowed'
        ? 'Necesito permiso para el micro 🎙️'
        : 'Uy, algo falló. Prueba a escribirlo.';
    }
  });

  send.addEventListener('click', () => submit(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(input.value); });
  backdrop.addEventListener('click', close);

  // Swipe-down to dismiss
  let startY = null;
  sheet.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchmove', e => {
    if (startY === null) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  sheet.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - (startY ?? 0);
    sheet.style.transform = '';
    startY = null;
    if (dy > 90) close();
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Route fallback: /tell-me opens the sheet over the dashboard. */
export default async function render() {
  const { default: dashboard } = await import('./dashboard.js');
  const el = await dashboard();
  setTimeout(openTellMe, 50);
  return el;
}
