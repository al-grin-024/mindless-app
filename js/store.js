/**
 * Mindless — Reactive Store
 */
import { db } from './db.js';
import {
  canUseCloudStore,
  loadUserWorkspace,
  replaceFamilyMembers,
  saveOnboardingState,
  saveFamilyMember,
  saveUserHousehold,
  saveUserProfile,
  saveUserSettings
} from './cloud-store.js';
import { defaultCategories } from './data/categories.js';

const USER_CACHE_KEY = 'mindless_user';
const onboardingKey = (userId) => `mindless_onboarded:${userId}`;

function hasCustomSettings(settings) {
  return Object.keys(settings || {}).some((key) => key !== 'financeSplit');
}

function hasRemoteWorkspace(workspace) {
  return !!(
    workspace?.profile
    || workspace?.household
    || Object.keys(workspace?.settings || {}).length
    || workspace?.onboarding?.completed
    || (workspace?.familyMembers || []).length
  );
}

function buildHouseholdSummary(user, settings, familyMembers) {
  const partner = settings?.partner || null;
  const ownerName = user?.givenName || user?.name || '';
  const childMembers = (familyMembers || []).filter((member) => String(member?.role || '').trim() === 'Peque');

  return {
    ownerName,
    partnerName: partner?.name || partner?.email || '',
    theme: settings?.theme || 'warm',
    kids: {
      count: childMembers.length,
      children: childMembers.map((member) => ({
        id: member.id,
        name: member.name || '',
        birthDate: member.birthDate || '',
      })),
    },
    familyMembers: (familyMembers || []).map((member) => ({
      id: member.id,
      name: member.name || '',
      role: member.role || 'Familia',
      emoji: member.emoji || '',
    })),
    familySize: (familyMembers || []).length,
  };
}

function hasPrimaryMember(user, familyMembers) {
  const ownerName = (user?.givenName || user?.name || '').trim().toLowerCase();
  if (!ownerName) return false;

  return (familyMembers || []).some((member) => {
    const memberName = String(member?.name || '').trim().toLowerCase();
    return memberName === ownerName && String(member?.role || '').trim() === 'Tú';
  });
}

function getChildMembers(familyMembers) {
  return (familyMembers || []).filter((member) => String(member?.role || '').trim() === 'Peque');
}

const _state = {
  user: null,
  partner: null,
  familyMembers: [],
  tasks: [],
  events: [],
  categories: [],
  expenses: [],
  isAuthenticated: false,
  isOnboarded: false,
  isOnline: navigator.onLine,
  settings: { financeSplit: '50/50' }
};

const _listeners = new Map();

function notify(prop, val) {
  (_listeners.get(prop) || []).forEach(fn => fn(val));
  (_listeners.get('*') || []).forEach(fn => fn(prop, val));
}

export const store = {
  state: new Proxy(_state, {
    set(target, prop, val) {
      target[prop] = val;
      notify(prop, val);
      return true;
    }
  }),

	  subscribe(prop, fn) {
    if (!_listeners.has(prop)) _listeners.set(prop, new Set());
    _listeners.get(prop).add(fn);
    if (prop !== '*') fn(this.state[prop]);
	    return () => { const s = _listeners.get(prop); if (s) s.delete(fn); };
	  },

    isOnboardingComplete() {
      const user = this.state.user;
      const settings = this.state.settings || {};
      const theme = settings.theme;
      const declaredKids = settings.kids;
      const childMembers = getChildMembers(this.state.familyMembers);

      if (!user?.id) return false;
      if (!theme || typeof theme !== 'string') return false;
      if (!declaredKids || !Number.isInteger(declaredKids.count) || declaredKids.count < 0) return false;
      if (childMembers.length !== declaredKids.count) return false;
      if (childMembers.some((member) => !String(member.name || '').trim() || !String(member.birthDate || '').trim())) return false;
      if (!hasPrimaryMember(user, this.state.familyMembers)) return false;

      return true;
    },

  async init() {
	    try {
	      await db.init();
	      const saved = localStorage.getItem(USER_CACHE_KEY);
      if (saved) {
        this.state.user = JSON.parse(saved);
        this.state.isAuthenticated = true;
        this.state.isOnboarded = localStorage.getItem(onboardingKey(this.state.user.id)) === 'true';
      }

      const [members, tasks, events, cats, expenses, settings] = await Promise.all([
        db.getAll('familyMembers'), db.getAll('tasks'), db.getAll('events'),
        db.getAll('categories'), db.getAll('expenses'), db.getAll('settings')
      ]);
      this.state.familyMembers = members || [];
      this.state.tasks = tasks || [];
      this.state.events = events || [];
      this.state.expenses = expenses || [];
      this.state.categories = (cats && cats.length) ? cats : [...defaultCategories];

      const settingsMap = {};
      (settings || []).forEach(s => settingsMap[s.id] = s.value);
      this.state.settings = { ...this.state.settings, ...settingsMap };

	      const partner = await db.get('settings', 'partner');
	      if (partner) this.state.partner = partner.value;

        this.state.isOnboarded = this.state.isOnboarded && this.isOnboardingComplete();

		      window.addEventListener('online', () => this.state.isOnline = true);
		      window.addEventListener('offline', () => this.state.isOnline = false);
	    } catch (e) { console.error('Store init:', e); }
	  },

    async _replaceLocalCollection(storeName, records) {
      await db.clear(storeName);
      await Promise.all((records || []).map((record) => db.put(storeName, { ...record })));
    },

    async _replaceLocalSettings(settings) {
      const entries = Object.entries(settings || {}).map(([id, value]) => ({ id, value }));
      await this._replaceLocalCollection('settings', entries);
    },

	    async persistUserProfile(user = this.state.user) {
	      if (!user?.id || !canUseCloudStore()) return;
	      await saveUserProfile(user.id, user);
	    },

    async persistHouseholdSummary(user = this.state.user) {
      if (!user?.id || !canUseCloudStore()) return;
      await saveUserHousehold(user.id, buildHouseholdSummary(user, this.state.settings, this.state.familyMembers));
    },

	    async pushUserDataToCloud(user = this.state.user) {
	      if (!user?.id || !canUseCloudStore()) return;

	      await Promise.all([
	        saveUserProfile(user.id, user),
          saveUserHousehold(user.id, buildHouseholdSummary(user, this.state.settings, this.state.familyMembers)),
	        saveUserSettings(user.id, this.state.settings),
	        saveOnboardingState(user.id, this.state.isOnboarded),
	        replaceFamilyMembers(user.id, this.state.familyMembers),
	      ]);
	    },

    async hydrateUserData(user = this.state.user) {
      if (!user?.id || !canUseCloudStore()) return;

      const workspace = await loadUserWorkspace(user.id);
      const localHasWorkspace = !!(
        this.state.partner
        || this.state.isOnboarded
        || this.state.familyMembers.length
        || hasCustomSettings(this.state.settings)
      );

      if (!hasRemoteWorkspace(workspace) && localHasWorkspace) {
        await this.pushUserDataToCloud(user);
        return;
      }

	      if (workspace.profile) {
	        const mergedUser = { ...workspace.profile, ...this.state.user, id: user.id };
	        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(mergedUser));
	        this.state.user = mergedUser;
	      }

	      if (Object.keys(workspace.settings || {}).length) {
	        this.state.settings = { ...this.state.settings, ...workspace.settings };
        } else if (workspace.household) {
          const householdChildren = Array.isArray(workspace.household.kids?.children)
            ? workspace.household.kids.children
            : [];
          this.state.settings = {
            ...this.state.settings,
            theme: workspace.household.theme || this.state.settings.theme,
            partner: workspace.household.partnerName ? { name: workspace.household.partnerName } : this.state.settings.partner,
            kids: {
              count: Number.isInteger(workspace.household.kids?.count) ? workspace.household.kids.count : householdChildren.length,
              children: householdChildren,
            },
          };
	      }

	      this.state.partner = this.state.settings.partner || null;

	      if (Array.isArray(workspace.familyMembers)) {
	        this.state.familyMembers = workspace.familyMembers;
        } else if (Array.isArray(workspace.household?.familyMembers)) {
          this.state.familyMembers = workspace.household.familyMembers;
	      }

	      if (workspace.onboarding?.completed) {
	        localStorage.setItem(onboardingKey(user.id), 'true');
	        this.state.isOnboarded = this.isOnboardingComplete();
	      }

      await Promise.all([
        this._replaceLocalSettings(this.state.settings),
        this._replaceLocalCollection('familyMembers', this.state.familyMembers),
      ]);
    },

	  async addTask(task) {
	    const saved = await db.put('tasks', { ...task, status: task.status || 'pending' });
    this.state.tasks = [...this.state.tasks, saved];
    return saved;
  },

  async updateTask(id, updates) {
    const idx = this.state.tasks.findIndex(t => t.id === id);
    if (idx === -1) return;
    const updated = { ...this.state.tasks[idx], ...updates };
    await db.put('tasks', updated);
    const arr = [...this.state.tasks]; arr[idx] = updated;
    this.state.tasks = arr;
  },

  async addExpense(expense) {
    const saved = await db.put('expenses', { ...expense, date: expense.date || Date.now() });
    this.state.expenses = [...this.state.expenses, saved];
    return saved;
  },

	  async addFamilyMember(member) {
	    const saved = await db.put('familyMembers', member);
	    this.state.familyMembers = [...this.state.familyMembers, saved];
	      if (this.state.user?.id && canUseCloudStore()) {
	        await saveFamilyMember(this.state.user.id, saved);
        await this.persistHouseholdSummary();
	      }
		    return saved;
		  },

	  async updateSetting(key, value) {
	    await db.put('settings', { id: key, value });
	    this.state.settings = { ...this.state.settings, [key]: value };
		    if (key === 'partner') this.state.partner = value;
	      if (this.state.user?.id && canUseCloudStore()) {
	        await Promise.all([
            saveUserSettings(this.state.user.id, this.state.settings),
            this.persistHouseholdSummary(),
          ]);
	      }
		  },

		  async markOnboarded() {
        const isComplete = this.isOnboardingComplete();
		    if (this.state.user?.id) {
		      localStorage.setItem(onboardingKey(this.state.user.id), isComplete ? 'true' : 'false');
	        if (canUseCloudStore()) {
	          await saveOnboardingState(this.state.user.id, isComplete);
	        }
		    }
		    this.state.isOnboarded = isComplete;
        return isComplete;
		  },

	  setAuthenticatedUser(user) {
	    if (!user) {
      localStorage.removeItem(USER_CACHE_KEY);
      this.state.user = null;
      this.state.isAuthenticated = false;
      this.state.isOnboarded = false;
      return;
    }

	    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
	    this.state.user = user;
	    this.state.isAuthenticated = true;
	    this.state.isOnboarded = localStorage.getItem(onboardingKey(user.id)) === 'true' && this.isOnboardingComplete();
	  },

  async logout() {
    localStorage.removeItem(USER_CACHE_KEY);
    await Promise.all(['familyMembers','tasks','events','categories','expenses','settings'].map(s => db.clear(s)));
    Object.assign(this.state, { user: null, partner: null, isAuthenticated: false, isOnboarded: false,
      familyMembers: [], tasks: [], events: [], expenses: [] });
  }
};
