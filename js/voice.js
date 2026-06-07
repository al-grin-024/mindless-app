/**
 * Mindless — Voice Input (Web Speech API, no TTS)
 */
import { getLanguage } from './i18n.js';

export const voice = {
  recognition: null,
  isSupported: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,

  init() {
    if (!this.isSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SR();
    this.recognition.lang = getLanguage() === 'en' ? 'en-US' : getLanguage();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  },

  listen() {
    if (!this.isSupported) return Promise.reject(new Error('NOT_SUPPORTED'));
    if (!this.recognition) this.init();
    return new Promise((resolve, reject) => {
      this.recognition.onresult = e => resolve(e.results[0][0].transcript);
      this.recognition.onerror = e => reject(new Error(e.error));
      this.recognition.onend = () => resolve('');
      try { this.recognition.start(); } catch (e) { reject(e); }
    });
  },

  stop() { if (this.recognition) this.recognition.stop(); }
};
