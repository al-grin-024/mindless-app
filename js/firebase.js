/**
 * Mindless — Firebase bootstrap
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';
import { firebaseConfig } from './firebase-config.js';

let _app = null;
let _auth = null;
let _provider = null;

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
  if (_provider) return _provider;

  _provider = new GoogleAuthProvider();
  _provider.setCustomParameters({ prompt: 'select_account' });
  return _provider;
}

