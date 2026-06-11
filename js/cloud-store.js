/**
 * Mindless — Firestore workspace sync
 */
import { getApp, getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
import { isFirebaseConfigured } from './firebase.js';

let _db = null;
let _cloudStoreAvailable = true;
let _warnedUnavailable = false;
let _warnedPermissionDenied = false;

function emptyWorkspace() {
  return {
    profile: null,
    household: null,
    settings: {},
    onboarding: {},
    familyMembers: [],
  };
}

function isCloudStoreUnavailableError(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes("database '(default)' not found")
    || message.includes('the database has not been created')
    || error?.code === 'not-found';
}

function isPermissionDeniedError(error) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes('missing or insufficient permissions')
    || error?.code === 'permission-denied';
}

function markCloudStoreUnavailable(error) {
  _cloudStoreAvailable = false;
  if (_warnedUnavailable) return;
  _warnedUnavailable = true;
  console.warn('Cloud Firestore unavailable. Falling back to local storage until Firestore is available and permitted.', error);
}

async function runCloudOperation(operation, fallbackValue) {
  if (!_cloudStoreAvailable) return fallbackValue;

  try {
    return await operation();
  } catch (error) {
    if (isPermissionDeniedError(error)) {
      if (!_warnedPermissionDenied) {
        _warnedPermissionDenied = true;
        console.warn('Cloud Firestore permission denied. Using local storage for now; retry after auth/rules are confirmed.', error);
      }
      return fallbackValue;
    }
    if (isCloudStoreUnavailableError(error)) {
      markCloudStoreUnavailable(error);
      return fallbackValue;
    }
    throw error;
  }
}

function getFirebaseAppInstance() {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

function getDb() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured. Update js/firebase-config.js with your project values.');
  }

  if (_db) return _db;
  _db = getFirestore(getFirebaseAppInstance());
  return _db;
}

function userDoc(userId) {
  return doc(getDb(), 'users', userId);
}

function userScopedDoc(userId, collectionName, docId = 'main') {
  return doc(getDb(), 'users', userId, collectionName, docId);
}

function familyMembersCollection(userId) {
  return collection(userDoc(userId), 'familyMembers');
}

export function canUseCloudStore() {
  return isFirebaseConfigured() && _cloudStoreAvailable;
}

export async function loadUserWorkspace(userId) {
  return runCloudOperation(async () => {
    const [userSnap, householdSnap, settingsSnap, onboardingSnap, familyMembersSnap] = await Promise.all([
      getDoc(userDoc(userId)),
      getDoc(userScopedDoc(userId, 'household')),
      getDoc(userScopedDoc(userId, 'settings')),
      getDoc(userScopedDoc(userId, 'onboarding')),
      getDocs(familyMembersCollection(userId)),
    ]);

    const userData = userSnap.exists() ? userSnap.data() : {};
    const householdData = householdSnap.exists() ? householdSnap.data() : {};
    const settingsData = settingsSnap.exists() ? settingsSnap.data() : {};
    const onboardingData = onboardingSnap.exists() ? onboardingSnap.data() : {};

    return {
      profile: userData.profile || null,
      household: householdData.household || userData.household || null,
      settings: settingsData.settings || userData.settings || {},
      onboarding: onboardingData.onboarding || userData.onboarding || {},
      familyMembers: familyMembersSnap.docs.map((snapshot) => ({
        id: snapshot.id,
        ...snapshot.data(),
      })),
    };
  }, emptyWorkspace());
}

export async function saveUserProfile(userId, profile) {
  await runCloudOperation(() => setDoc(userDoc(userId), {
    profile,
    updatedAt: Date.now(),
  }, { merge: true }), null);
}

export async function saveUserSettings(userId, settings) {
  await runCloudOperation(() => setDoc(userScopedDoc(userId, 'settings'), {
    settings,
    updatedAt: Date.now(),
  }, { merge: true }), null);
}

export async function saveUserHousehold(userId, household) {
  await runCloudOperation(() => setDoc(userScopedDoc(userId, 'household'), {
    household,
    updatedAt: Date.now(),
  }, { merge: true }), null);
}

export async function saveOnboardingState(userId, completed) {
  await runCloudOperation(() => setDoc(userScopedDoc(userId, 'onboarding'), {
    onboarding: {
      completed: !!completed,
      completedAt: completed ? Date.now() : null,
    },
    updatedAt: Date.now(),
  }, { merge: true }), null);
}

export async function saveFamilyMember(userId, member) {
  const memberId = member.id || crypto.randomUUID();
  const payload = {
    ...member,
    id: memberId,
    updatedAt: Date.now(),
    createdAt: member.createdAt || Date.now(),
  };

  await runCloudOperation(
    () => setDoc(doc(familyMembersCollection(userId), memberId), payload, { merge: true }),
    null
  );
  return payload;
}

export async function replaceFamilyMembers(userId, members) {
  await runCloudOperation(async () => {
    const existing = await getDocs(familyMembersCollection(userId));
    const existingIds = new Set(existing.docs.map((snapshot) => snapshot.id));
    const nextIds = new Set();

    await Promise.all(members.map(async (member) => {
      const saved = await saveFamilyMember(userId, member);
      nextIds.add(saved.id);
    }));

    const removals = [...existingIds]
      .filter((id) => !nextIds.has(id))
      .map((id) => deleteDoc(doc(familyMembersCollection(userId), id)));

    await Promise.all(removals);
  }, null);
}
