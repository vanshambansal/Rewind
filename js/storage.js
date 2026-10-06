/**
 * storage.js — Low-level persistence layer.
 *
 *   IndexedDB  →  file / folder entries
 *   LocalStorage  →  simple settings (wallpaper, sound, etc.)
 */

const DB_NAME    = 'RewindFS';
const DB_VERSION = 1;
const STORE      = 'entries';

let db = null;


// ── IndexedDB helpers ────────────────────────────────────────────

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains(STORE)) {
                const store = database.createObjectStore(STORE, { keyPath: 'id' });
                store.createIndex('path',       'path',       { unique: true });
                store.createIndex('parentPath', 'parentPath', { unique: false });
                store.createIndex('deleted',    'deleted',    { unique: false });
            }
        };

        req.onsuccess = (e) => { db = e.target.result; resolve(db); };
        req.onerror   = (e) => reject(e.target.error);
    });
}

function tx(mode = 'readonly') {
    return db.transaction(STORE, mode).objectStore(STORE);
}

function req(idbRequest) {
    return new Promise((resolve, reject) => {
        idbRequest.onsuccess = () => resolve(idbRequest.result);
        idbRequest.onerror   = () => reject(idbRequest.error);
    });
}


// ── Public API ───────────────────────────────────────────────────

export const Storage = {

    async init() {
        if (db) return;              // already open
        await openDB();
    },

    // ── Entry CRUD (IndexedDB) ──────────────────────────────

    /** Insert or update an entry. */
    async putEntry(entry) {
        return req(tx('readwrite').put(entry));
    },

    /** Get entry by its UUID. */
    async getEntry(id) {
        return req(tx().get(id));
    },

    /** Get the (non-recycled) entry at a given path. */
    async getEntryByPath(path) {
        return req(tx().index('path').get(path));
    },

    /** All entries whose parentPath matches. */
    async getEntriesByParent(parentPath) {
        return req(tx().index('parentPath').getAll(parentPath));
    },

    /** All entries marked deleted. */
    async getDeletedEntries() {
        const all = await this.getAllEntries();
        return all.filter(e => !!e.deleted);
    },

    /** Hard-remove an entry from the DB. */
    async removeEntry(id) {
        return req(tx('readwrite').delete(id));
    },

    /** Return every entry in the store (debug / migration). */
    async getAllEntries() {
        return req(tx().getAll());
    },

    /** Wipe the entire store (debug). */
    async clearAll() {
        return req(tx('readwrite').clear());
    },


    // ── Settings (LocalStorage) ─────────────────────────────

    getSetting(key, defaultValue = null) {
        try {
            const raw = localStorage.getItem('rewind_' + key);
            return raw !== null ? JSON.parse(raw) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    setSetting(key, value) {
        try {
            localStorage.setItem('rewind_' + key, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage.setSetting failed:', key, e);
        }
    },

    removeSetting(key) {
        localStorage.removeItem('rewind_' + key);
    },
};
