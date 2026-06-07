/**
 * Mindless — i18n Translation Engine
 */
import { translations as en } from './data/translations-en.js';

const langs = { en };
let lang = 'en';

export function initI18n() {
  const saved = localStorage.getItem('mindless_lang');
  if (saved && langs[saved]) { lang = saved; return; }
  const browser = navigator.language.split('-')[0];
  if (langs[browser]) lang = browser;
}

export function t(keyPath, vars = {}) {
  const keys = keyPath.split('.');
  let val = langs[lang];
  for (const k of keys) {
    if (val == null) break;
    val = val[k];
  }
  if (val === undefined) { console.warn(`[i18n] Missing: ${keyPath}`); return keyPath; }
  if (typeof val === 'string' && Object.keys(vars).length) {
    return val.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? vars[k] : `{${k}}`);
  }
  return val;
}

export function getLanguage() { return lang; }
