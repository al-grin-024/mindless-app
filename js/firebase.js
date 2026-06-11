/**
 * Mindless — Firebase bootstrap
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js';
import {
  browserLocalPersistence,
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

let _app = null;
let _auth = null;
let _googleProvider = null;
let _googleCalendarProvider = null;

function hasRealValue(value) {
  return typeof value === 'string' && value !== '' && !value.startsWith('YOUR_');
}

export function isFirebaseConfigured() {
  return ['apiKey', 'authDomain', 'projectId', 'appId'].every(key => hasRealValue(firebaseConfig[key]));
}

export async function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Update js/firebase-config.js with your project values.');
  }

  if (_auth) return _auth;

  _app = initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  await setPersistence(_auth, browserLocalPersistence);
  return _auth;
}

export function getGoogleProvider() {
  if (_googleProvider) return _googleProvider;

  _googleProvider = new GoogleAuthProvider();
  _googleProvider.setCustomParameters({ prompt: 'select_account' });
  return _googleProvider;
}

export function getGoogleCalendarProvider() {
  if (_googleCalendarProvider) return _googleCalendarProvider;

  _googleCalendarProvider = new GoogleAuthProvider();
  _googleCalendarProvider.setCustomParameters({
    prompt: 'consent',
    access_type: 'offline',
  });
  _googleCalendarProvider.addScope('https://www.googleapis.com/auth/calendar.events');
  _googleCalendarProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  return _googleCalendarProvider;
}

export function getEmailProvider() {
  return EmailAuthProvider.PROVIDER_ID;
}
