/**
 * Mindless — Reactive Store
 */
import { db } from './db.js';
import { defaultCategories } from './data/categories.js';

const USER_CACHE_KEY = 'mindless_user';
const onboardingKey = (userId) => `mindless_onboarded:${userId}`;

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

      window.addEventListener('online', () => this.state.isOnline = true);
      window.addEventListener('offline', () => this.state.isOnline = false);
    } catch (e) { console.error('Store init:', e); }
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
    return saved;
  },

  async updateSetting(key, value) {
    await db.put('settings', { id: key, value });
    this.state.settings = { ...this.state.settings, [key]: value };
    if (key === 'partner') this.state.partner = value;
  },

  async markOnboarded() {
    if (this.state.user?.id) {
      localStorage.setItem(onboardingKey(this.state.user.id), 'true');
    }
    this.state.isOnboarded = true;
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
    this.state.isOnboarded = localStorage.getItem(onboardingKey(user.id)) === 'true';
  },

  async logout() {
    localStorage.removeItem(USER_CACHE_KEY);
    await Promise.all(['familyMembers','tasks','events','categories','expenses','settings'].map(s => db.clear(s)));
    Object.assign(this.state, { user: null, partner: null, isAuthenticated: false, isOnboarded: false,
      familyMembers: [], tasks: [], events: [], expenses: [] });
  }
};
