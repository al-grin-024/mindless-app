/**
 * Mindless — Firebase Authentication
 */
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  linkWithPopup,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js';
import { store } from './store.js';
import { router } from './router.js';
import {
  getFirebaseAuth,
  getGoogleCalendarProvider,
  getGoogleProvider,
  isFirebaseConfigured
} from './firebase.js';

const PASSWORD_POLICY = {
  minLength: 8,
  minUppercase: 1,
  minLowercase: 1,
  minDigits: 2,
  minSymbols: 2,
};

function countMatches(value, pattern) {
  return (value.match(pattern) || []).length;
}

export function isStrongPassword(password) {
  return password.length >= PASSWORD_POLICY.minLength
    && countMatches(password, /[A-Z]/g) >= PASSWORD_POLICY.minUppercase
    && countMatches(password, /[a-z]/g) >= PASSWORD_POLICY.minLowercase
    && countMatches(password, /\d/g) >= PASSWORD_POLICY.minDigits
    && countMatches(password, /[^A-Za-z0-9]/g) >= PASSWORD_POLICY.minSymbols;
}

function buildAccountCapabilities(user) {
  const providers = user.providerData?.map((entry) => entry.providerId).filter(Boolean) || [];
  const hasGoogle = providers.includes('google.com');

  return {
    providers,
    authMethod: providers[0] || 'unknown',
    googleLinked: hasGoogle,
    canLinkGoogle: !hasGoogle,
    calendar: {
      readyToConnect: hasGoogle,
      connected: false,
      scopes: [],
    }
  };
}

function getReadableError(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'Ese email ya tiene cuenta. Prueba a iniciar sesion.';
    case 'auth/invalid-email':
      return 'El email no parece valido.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email o contrasena incorrectos.';
    case 'auth/weak-password':
      return 'La contrasena debe tener al menos 8 caracteres, una mayuscula, una minuscula, 2 numeros y 2 simbolos.';
    case 'auth/account-exists-with-different-credential':
      return 'Ese email ya existe con otro metodo de acceso.';
    case 'auth/popup-blocked':
      return 'El navegador bloqueo la ventana emergente de Google.';
    case 'auth/unauthorized-domain':
      return 'Este dominio no esta autorizado en Firebase Auth.';
    default:
      return error?.message || 'No se pudo completar la autenticacion.';
  }
}

function withReadableError(error) {
  if (error && !error.userMessage) {
    error.userMessage = getReadableError(error);
  }
  return error;
}

function normalizeUser(user) {
  if (!user) return null;

  const capabilities = buildAccountCapabilities(user);
  return {
    id: user.uid,
    name: user.displayName || user.email || 'User',
    givenName: user.displayName ? user.displayName.split(' ')[0] : '',
    email: user.email || '',
    photoUrl: user.photoURL || '',
    provider: capabilities.authMethod,
    providers: capabilities.providers,
    emailVerified: !!user.emailVerified,
    lastLoginAt: user.metadata?.lastSignInTime || null,
    googleLinked: capabilities.googleLinked,
    canLinkGoogle: capabilities.canLinkGoogle,
    calendar: capabilities.calendar,
  };
}

export const auth = {
  _initialized: false,
  _ready: null,
  _signInPromise: null,
  isStrongPassword,

  async _syncRouteAfterAuth() {
    if (!router.container) return;

    const targetPath = store.state.isOnboarded ? '/' : '/onboarding';
    const currentPath = router.currentPath || window.location.pathname;

    if (currentPath === '/welcome' || currentPath === '/onboarding') {
      await router.navigate(targetPath);
      return;
    }

    await router.route();
  },

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
            store.setAuthenticatedUser(null);
            if (firstSync) {
              firstSync = false;
              resolve();
            }
            return;
          }

          store.setAuthenticatedUser(normalizeUser(firebaseUser));
          await store.hydrateUserData();
          await store.persistUserProfile();
          await store.persistHouseholdSummary();
          await this._syncRouteAfterAuth();

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
      alert(withReadableError(error).userMessage);
    }
  },

  async signIn() {
    if (this._signInPromise) return this._signInPromise;

    const firebaseAuth = await getFirebaseAuth();
    const provider = getGoogleProvider();
    this._signInPromise = signInWithPopup(firebaseAuth, provider)
      .then(async (result) => {
        const user = normalizeUser(result.user);
        store.setAuthenticatedUser(user);
        await store.hydrateUserData();
        await store.persistUserProfile();
        await store.persistHouseholdSummary();
        await this._syncRouteAfterAuth();
        return store.state.user;
      })
      .finally(() => {
        this._signInPromise = null;
      });

    return this._signInPromise;
  },

  async signInWithEmail(email, password) {
    try {
      const firebaseAuth = await getFirebaseAuth();
      const result = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const user = normalizeUser(result.user);

      store.setAuthenticatedUser(user);
      await store.hydrateUserData();
      await store.persistUserProfile();
      await store.persistHouseholdSummary();
      router.navigate(store.state.isOnboarded ? '/' : '/onboarding');
      return store.state.user;
    } catch (error) {
      throw withReadableError(error);
    }
  },

  async signUpWithEmail({ name, email, password }) {
    try {
      if (!isStrongPassword(password)) {
        const error = new Error('Weak password');
        error.code = 'auth/weak-password';
        throw error;
      }

      const firebaseAuth = await getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);

      if (name?.trim()) {
        await updateProfile(result.user, { displayName: name.trim() });
      }

      const user = normalizeUser(firebaseAuth.currentUser || result.user);
      store.setAuthenticatedUser(user);
      await store.persistUserProfile();
      await store.persistHouseholdSummary();
      router.navigate('/onboarding');
      return store.state.user;
    } catch (error) {
      throw withReadableError(error);
    }
  },

  async getSignInMethods(email) {
    const firebaseAuth = await getFirebaseAuth();
    return fetchSignInMethodsForEmail(firebaseAuth, email.trim());
  },

  async linkGoogleIdentity() {
    const firebaseAuth = await getFirebaseAuth();
    if (!firebaseAuth.currentUser) {
      throw new Error('Necesitas haber iniciado sesion para vincular Google.');
    }

    const result = await linkWithPopup(firebaseAuth.currentUser, getGoogleProvider());
    const user = normalizeUser(result.user);
    store.setAuthenticatedUser(user);
    await store.persistUserProfile();
    await store.persistHouseholdSummary();
    return store.state.user;
  },

  async prepareGoogleCalendarConnection() {
    const firebaseAuth = await getFirebaseAuth();
    if (!firebaseAuth.currentUser) {
      throw new Error('Necesitas haber iniciado sesion para conectar Google Calendar.');
    }

    const user = normalizeUser(firebaseAuth.currentUser);
    return {
      user,
      provider: getGoogleCalendarProvider(),
      requiresGoogleAccountLink: !user.googleLinked,
      plannedScopes: ['calendar.events', 'calendar.readonly'],
    };
  },

  async getIdToken() {
    const firebaseAuth = await getFirebaseAuth();
    return firebaseAuth.currentUser ? firebaseAuth.currentUser.getIdToken() : null;
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
