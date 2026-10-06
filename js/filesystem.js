/**
 * filesystem.js — Virtual filesystem stored in IndexedDB.
 *
 * Provides a simulated C: drive with folders and files.
 * Supports CRUD, soft-delete (Recycle Bin), restore, rename, and move.
 *
 * Path convention:
 *   Root          →  "C:"
 *   Top folder    →  "C:/My Documents"
 *   File          →  "C:/My Documents/readme.txt"
 *   Recycled      →  "__recycled__/{entry.id}"   (freed from unique path index)
 */

import { Storage } from './storage.js';


// ── Path utilities ───────────────────────────────────────────────

function generateId() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function getParentPath(path) {
    if (!path || path === 'C:') return null;
    const i = path.lastIndexOf('/');
    if (i < 0) return null;
    const parent = path.substring(0, i);
    return parent || 'C:';
}

function getFileName(path) {
    const i = path.lastIndexOf('/');
    return i < 0 ? path : path.substring(i + 1);
}

function joinPath(parent, name) {
    return parent === 'C:' ? `C:/${name}` : `${parent}/${name}`;
}

function getExtension(name) {
    const i = name.lastIndexOf('.');
    return i > 0 ? name.substring(i).toLowerCase() : '';
}

function guessMimeType(name) {
    const map = {
        '.txt': 'text/plain',
        '.bmp': 'image/bmp',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.ogg': 'audio/ogg',
    };
    return map[getExtension(name)] || 'application/octet-stream';
}


// ── Default structure ────────────────────────────────────────────

const DEFAULT_FOLDERS = [
    'C:',
    'C:/My Documents',
    'C:/My Pictures',
    'C:/My Music',
    'C:/Downloads',
    'C:/Programs',
];

function makeEntry(overrides = {}) {
    const entry = {
        id:             generateId(),
        name:           '',
        type:           'file',
        mimeType:       null,
        path:           '',
        parentPath:     null,
        content:        null,
        blob:           null,
        dataUrl:        null,
        size:           0,
        created:        Date.now(),
        modified:       Date.now(),
        deleted:        false,
        deletedFrom:    null,
        deletedAsChild: false,
    };

    for (const key of Object.keys(overrides)) {
        if (overrides[key] !== undefined) {
            entry[key] = overrides[key];
        }
    }

    if (!entry.id) {
        entry.id = generateId();
    }

    return entry;
}

/** Create default folders if they don't already exist. */
async function ensureDefaults() {
    for (const path of DEFAULT_FOLDERS) {
        const existing = await Storage.getEntryByPath(path);
        if (!existing) {
            await Storage.putEntry(makeEntry({
                name:       getFileName(path) || 'C:',
                type:       'folder',
                path,
                parentPath: getParentPath(path),
            }));
        }
    }
}

/** Seed a couple of sample files on first run. */
async function seedSampleFiles() {
    const docs = await FileSystem.listDirectory('C:/My Documents');
    if (docs.length > 0) return;       // already seeded

    await FileSystem.createFile(
        'C:/My Documents', 'Welcome.txt',
        'Welcome to your computer!\r\n\r\n'
      + 'This is your personal computer. You can create\r\n'
      + 'documents, draw pictures, listen to music, and more.\r\n\r\n'
      + 'Have fun exploring!',
    );
    await FileSystem.createFile(
        'C:/My Documents', 'readme.txt',
        'Files you create are stored inside your browser.\r\n'
      + 'They will persist between visits as long as you\r\n'
      + 'do not clear your browser data.',
    );
}


// ── Public API ───────────────────────────────────────────────────

export const FileSystem = {

    // Expose path helpers for other modules
    getParentPath,
    getFileName,
    joinPath,
    getExtension,
    guessMimeType,

    /** Initialise the DB and default folder structure. */
    async init() {
        await Storage.init();
        await ensureDefaults();
        await seedSampleFiles();
    },


    // ══════════════════════════════════════════════════════════
    //  CREATE
    // ══════════════════════════════════════════════════════════

    /**
     * Create a new file.
     * @param {string}      parentPath  e.g. "C:/My Documents"
     * @param {string}      name        e.g. "readme.txt"
     * @param {string|Blob} [content]   text or binary
     * @param {string}      [mimeType]  auto-detected if omitted
     * @returns {Promise<Object>}       the created entry
     */
    async createFile(parentPath, name, content = '', mimeType = null) {
        const parent = await Storage.getEntryByPath(parentPath);
        if (!parent || parent.type !== 'folder' || parent.deleted) {
            throw new Error(`Parent folder not found: ${parentPath}`);
        }

        const path = joinPath(parentPath, name);
        const existing = await Storage.getEntryByPath(path);
        if (existing && !existing.deleted) {
            throw new Error(`File already exists: ${path}`);
        }

        const isBlob = content instanceof Blob;
        const entry = makeEntry({
            id:         existing ? existing.id : undefined,
            name,
            type:       'file',
            mimeType:   mimeType || guessMimeType(name),
            path,
            parentPath,
            content:    isBlob ? null : content,
            blob:       isBlob ? content : null,
            size:       isBlob ? content.size
                      : (typeof content === 'string' ? new Blob([content]).size : 0),
            created:    existing ? existing.created : Date.now(),
        });

        await Storage.putEntry(entry);
        return entry;
    },

    /**
     * Create a new folder.
     */
    async createFolder(parentPath, name) {
        const parent = await Storage.getEntryByPath(parentPath);
        if (!parent || parent.type !== 'folder' || parent.deleted) {
            throw new Error(`Parent folder not found: ${parentPath}`);
        }

        const path = joinPath(parentPath, name);
        const existing = await Storage.getEntryByPath(path);
        if (existing && !existing.deleted) {
            throw new Error(`Folder already exists: ${path}`);
        }

        const entry = makeEntry({
            id:         existing ? existing.id : undefined,
            name,
            type:       'folder',
            path,
            parentPath,
            created:    existing ? existing.created : Date.now(),
        });

        await Storage.putEntry(entry);
        return entry;
    },


    // ══════════════════════════════════════════════════════════
    //  READ
    // ══════════════════════════════════════════════════════════

    /** Get a single non-deleted entry by path, or null. */
    async getEntry(path) {
        const e = await Storage.getEntryByPath(path);
        return (e && !e.deleted) ? e : null;
    },

    /** Read file content (string or Blob). */
    async readFile(path) {
        const e = await this.getEntry(path);
        if (!e)                throw new Error(`File not found: ${path}`);
        if (e.type !== 'file') throw new Error(`Not a file: ${path}`);
        return e.blob || e.content;
    },

    /** List non-deleted children. Folders first, then alphabetical. */
    async listDirectory(path) {
        const entries = await Storage.getEntriesByParent(path);
        return entries
            .filter(e => !e.deleted)
            .sort((a, b) => {
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.name.localeCompare(b.name);
            });
    },

    /** Does a non-deleted entry exist at this path? */
    async exists(path) {
        const e = await Storage.getEntryByPath(path);
        return !!(e && !e.deleted);
    },


    // ══════════════════════════════════════════════════════════
    //  UPDATE
    // ══════════════════════════════════════════════════════════

    /** Overwrite a file's content. */
    async updateFile(path, content) {
        const e = await Storage.getEntryByPath(path);
        if (!e || e.deleted)   throw new Error(`File not found: ${path}`);
        if (e.type !== 'file') throw new Error(`Not a file: ${path}`);

        const isBlob = content instanceof Blob;
        e.content  = isBlob ? null : content;
        e.blob     = isBlob ? content : null;
        e.size     = isBlob ? content.size : new Blob([content]).size;
        e.modified = Date.now();

        await Storage.putEntry(e);
        return e;
    },

    /** Rename a file or folder (stays in the same parent). */
    async renameEntry(path, newName) {
        if (path === 'C:') throw new Error('Cannot rename root');
        const e = await Storage.getEntryByPath(path);
        if (!e || e.deleted) throw new Error(`Entry not found: ${path}`);

        const newPath = joinPath(e.parentPath, newName);
        if (await this.exists(newPath)) {
            throw new Error(`Already exists: ${newPath}`);
        }

        // Recursively update child paths for folders
        if (e.type === 'folder') {
            await this._updateChildPaths(e.path, newPath);
        }

        // Remove old, insert updated (path index is unique)
        await Storage.removeEntry(e.id);
        e.name     = newName;
        e.path     = newPath;
        e.modified = Date.now();
        if (e.type === 'file') e.mimeType = guessMimeType(newName);
        await Storage.putEntry(e);
        return e;
    },

    /** Move an entry to a different parent folder. */
    async moveEntry(path, newParentPath) {
        const e = await Storage.getEntryByPath(path);
        if (!e || e.deleted) throw new Error(`Entry not found: ${path}`);

        const newParent = await this.getEntry(newParentPath);
        if (!newParent || newParent.type !== 'folder') {
            throw new Error(`Target folder not found: ${newParentPath}`);
        }

        const newPath = joinPath(newParentPath, e.name);
        if (await this.exists(newPath)) {
            throw new Error(`Already exists: ${newPath}`);
        }

        if (e.type === 'folder') {
            await this._updateChildPaths(e.path, newPath);
        }

        await Storage.removeEntry(e.id);
        e.path       = newPath;
        e.parentPath = newParentPath;
        e.modified   = Date.now();
        await Storage.putEntry(e);
        return e;
    },

    /** Recursively re-path children when a folder is renamed / moved. */
    async _updateChildPaths(oldBase, newBase) {
        const children = await Storage.getEntriesByParent(oldBase);
        for (const child of children) {
            const newChildPath = newBase + '/' + child.name;
            if (child.type === 'folder') {
                await this._updateChildPaths(child.path, newChildPath);
            }
            await Storage.removeEntry(child.id);
            child.path       = newChildPath;
            child.parentPath = newBase;
            await Storage.putEntry(child);
        }
    },


    // ══════════════════════════════════════════════════════════
    //  DELETE  /  RECYCLE BIN
    // ══════════════════════════════════════════════════════════

    /**
     * Soft-delete → moves entry to the Recycle Bin.
     * The entry's path is changed to "__recycled__/{id}" so the
     * original path is freed for reuse.
     */
    async deleteEntry(path) {
        if (DEFAULT_FOLDERS.includes(path)) {
            throw new Error(`Cannot delete system folder: ${path}`);
        }
        const e = await Storage.getEntryByPath(path);
        if (!e || e.deleted) throw new Error(`Entry not found: ${path}`);

        const originalPath = e.path;

        e.deleted        = true;
        e.deletedFrom    = originalPath;
        e.deletedAsChild = false;
        e.path           = `__recycled__/${e.id}`;
        e.parentPath     = '__recycled__';
        e.modified       = Date.now();
        await Storage.putEntry(e);

        if (e.type === 'folder') {
            await this._softDeleteChildren(originalPath);
        }
        return e;
    },

    /** Recursively soft-delete folder contents. */
    async _softDeleteChildren(parentPath) {
        const children = await Storage.getEntriesByParent(parentPath);
        for (const child of children) {
            if (child.deleted) continue;
            const origPath = child.path;

            child.deleted        = true;
            child.deletedFrom    = origPath;
            child.deletedAsChild = true;
            child.path           = `__recycled__/${child.id}`;
            child.parentPath     = '__recycled__';
            child.modified       = Date.now();
            await Storage.putEntry(child);

            if (child.type === 'folder') {
                await this._softDeleteChildren(origPath);
            }
        }
    },

    /**
     * Restore an entry from the Recycle Bin.
     * If the original location has a conflict, a numbered suffix is added.
     */
    async restoreEntry(id) {
        const e = await Storage.getEntry(id);
        if (!e || !e.deleted) throw new Error('Entry not found in Recycle Bin');

        const originalDeleted = e.deletedFrom;
        let restoreParent = getParentPath(originalDeleted);
        let restorePath   = originalDeleted;

        // If original parent is gone, fall back to root
        const parent = await this.getEntry(restoreParent);
        if (!parent) {
            restoreParent = 'C:';
            restorePath   = joinPath('C:', e.name);
        }

        // Handle path conflict
        if (await this.exists(restorePath)) {
            const newName = await this.getUniqueName(restoreParent, e.name);
            restorePath = joinPath(restoreParent, newName);
            e.name = newName;
        }

        // Remove recycled entry (old path), re-insert with real path
        await Storage.removeEntry(e.id);
        e.path           = restorePath;
        e.parentPath     = restoreParent;
        e.deleted        = false;
        e.deletedFrom    = null;
        e.deletedAsChild = false;
        e.modified       = Date.now();
        await Storage.putEntry(e);

        // Restore children of folders
        if (e.type === 'folder' && originalDeleted) {
            const recycled = await Storage.getDeletedEntries();
            for (const child of recycled) {
                if (!child.deletedAsChild || !child.deletedFrom) continue;
                if (!child.deletedFrom.startsWith(originalDeleted + '/')) continue;

                const relative   = child.deletedFrom.substring(originalDeleted.length);
                const childPath  = restorePath + relative;
                const childParent = getParentPath(childPath);

                await Storage.removeEntry(child.id);
                child.path           = childPath;
                child.parentPath     = childParent;
                child.deleted        = false;
                child.deletedFrom    = null;
                child.deletedAsChild = false;
                child.modified       = Date.now();
                await Storage.putEntry(child);
            }
        }
        return e;
    },

    /** Permanently remove one entry from the DB. */
    async permanentDelete(id) {
        const e = await Storage.getEntry(id);
        if (!e) return;

        // If folder, also remove recycled children
        if (e.type === 'folder' && e.deletedFrom) {
            const recycled = await Storage.getDeletedEntries();
            for (const child of recycled) {
                if (child.deletedFrom &&
                    child.deletedFrom.startsWith(e.deletedFrom + '/')) {
                    await Storage.removeEntry(child.id);
                }
            }
        }
        await Storage.removeEntry(id);
    },

    /** Top-level Recycle Bin contents (excludes child-of-folder items). */
    async listRecycleBin() {
        const all = await Storage.getDeletedEntries();
        return all
            .filter(e => !e.deletedAsChild)
            .sort((a, b) => b.modified - a.modified);
    },

    /** Hard-delete every entry in the Recycle Bin. */
    async emptyRecycleBin() {
        const all = await Storage.getDeletedEntries();
        for (const e of all) {
            await Storage.removeEntry(e.id);
        }
    },

    /** Count of top-level recycled items. */
    async getRecycleBinCount() {
        return (await this.listRecycleBin()).length;
    },


    // ══════════════════════════════════════════════════════════
    //  HELPERS
    // ══════════════════════════════════════════════════════════

    /**
     * Generate "name (2).ext" style unique names.
     */
    async getUniqueName(parentPath, name) {
        let candidate = name;
        let n = 2;
        while (await this.exists(joinPath(parentPath, candidate))) {
            const ext  = getExtension(name);
            const base = ext ? name.substring(0, name.length - ext.length) : name;
            candidate  = `${base} (${n})${ext}`;
            n++;
        }
        return candidate;
    },

    /**
     * Format byte size for display.
     */
    formatSize(bytes) {
        if (bytes === 0) return '0 bytes';
        if (bytes < 1024) return bytes + ' bytes';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    },
};
