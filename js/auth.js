/**
 * Mindless — Firebase Authentication
 */
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';
import { store } from './store.js';
import { router } from './router.js';
import { getFirebaseAuth, getGoogleProvider, isFirebaseConfigured } from './firebase.js';

function normalizeUser(user, accessToken = null) {
  if (!user) return null;

  return {
    id: user.uid,
    name: user.displayName || user.email || 'User',
    givenName: user.displayName ? user.displayName.split(' ')[0] : '',
    email: user.email || '',
    photoUrl: user.photoURL || '',
    provider: user.providerData?.[0]?.providerId || 'google.com',
    token: accessToken,
  };
}

function persistUser(user) {
  if (!user) {
    localStorage.removeItem('mindless_user');
    store.state.user = null;
    store.state.isAuthenticated = false;
    return;
  }

  localStorage.setItem('mindless_user', JSON.stringify(user));
  store.state.user = user;
  store.state.isAuthenticated = true;
}

export const auth = {
  _initialized: false,
  _ready: null,

  async init() {
    if (this._ready) return this._ready;
    if (!isFirebaseConfigured()) return;

    this._initialized = true;
    this._ready = new Promise(async (resolve) => {
      let firstSync = true;

      try {
        const firebaseAuth = await getFirebaseAuth();
        onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
          if (!firebaseUser) {
            persistUser(null);
            if (firstSync) {
              firstSync = false;
              resolve();
            }
            return;
          }

          const token = await firebaseUser.getIdToken().catch(() => null);
          persistUser(normalizeUser(firebaseUser, token));

          if (firstSync) {
            firstSync = false;
            resolve();
          }
        });
      } catch (error) {
        console.error('Firebase auth init failed:', error);
        resolve();
      }
    });

    return this._ready;
  },

  async handleGoogleClick() {
    try {
      await this.signIn();
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert(error.message || 'No se pudo iniciar sesion con Google.');
    }
  },

  async signIn() {
    const firebaseAuth = await getFirebaseAuth();
    const provider = getGoogleProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = normalizeUser(result.user, credential?.accessToken || null);

    persistUser(user);
    router.navigate(store.state.isOnboarded ? '/' : '/onboarding');
    return user;
  },

  async signOut() {
    try {
      if (isFirebaseConfigured()) {
        const firebaseAuth = await getFirebaseAuth();
        await firebaseSignOut(firebaseAuth);
      }
    } finally {
      await store.logout();
      router.navigate('/welcome');
    }
  }
};
