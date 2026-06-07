/**
 * Mindless — Voice button helper
 * A small reusable mic button that opens the "Cuéntame" sheet.
 * (The hero mic lives in the nav-bar; this is for in-view prompts.)
 */
import { openTellMe } from '../views/tell-me.js';

/** Returns a pill button that opens the Cuéntame sheet. */
export function voiceButton(label = 'Cuéntame algo') {
  const btn = document.createElement('button');
  btn.className = 'btn btn-ghost';
  btn.innerHTML = `<i class="ph ph-microphone"></i><span>${label}</span>`;
  btn.addEventListener('click', () => openTellMe());
  return btn;
}

/** <voice-button label="..."> custom element wrapper. */
class VoiceButton extends HTMLElement {
  connectedCallback() {
    const label = this.getAttribute('label') || 'Cuéntame algo';
    this.appendChild(voiceButton(label));
  }
}
customElements.define('voice-button', VoiceButton);
