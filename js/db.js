/**
 * Mindless — IndexedDB Wrapper
 */
const DB_NAME = 'mindless_db';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('familyMembers')) {
        const s = db.createObjectStore('familyMembers', { keyPath: 'id' });
        s.createIndex('role', 'role', { unique: false });
      }
      if (!db.objectStoreNames.contains('tasks')) {
        const s = db.createObjectStore('tasks', { keyPath: 'id' });
        s.createIndex('categoryId', 'categoryId', { unique: false });
        s.createIndex('status', 'status', { unique: false });
        s.createIndex('dueDate', 'dueDate', { unique: false });
      }
      if (!db.objectStoreNames.contains('events')) {
        const s = db.createObjectStore('events', { keyPath: 'id' });
        s.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('expenses')) {
        const s = db.createObjectStore('expenses', { keyPath: 'id' });
        s.createIndex('date', 'date', { unique: false });
        s.createIndex('paidBy', 'paidBy', { unique: false });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };
  });
}

let _db = null;
async function getDB() {
  if (!_db) _db = await openDB();
  return _db;
}

export const db = {
  async init() { await getDB(); },

  async getAll(store) {
    const d = await getDB();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readonly');
      const r = tx.objectStore(store).getAll();
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  },

  async get(store, id) {
    const d = await getDB();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readonly');
      const r = tx.objectStore(store).get(id);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  },

  async put(store, data) {
    const d = await getDB();
    if (!data.id) data.id = crypto.randomUUID();
    data.updatedAt = Date.now();
    if (!data.createdAt) data.createdAt = Date.now();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      const r = tx.objectStore(store).put(data);
      r.onsuccess = () => res(data);
      r.onerror = () => rej(r.error);
    });
  },

  async delete(store, id) {
    const d = await getDB();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      const r = tx.objectStore(store).delete(id);
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
  },

  async clear(store) {
    const d = await getDB();
    return new Promise((res, rej) => {
      const tx = d.transaction(store, 'readwrite');
      const r = tx.objectStore(store).clear();
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
  }
};
