/**
 * recycleBin.js — Classic Recycle Bin application.
 *
 * Supports:
 *   - Viewing soft-deleted virtual files
 *   - Restoring files to their original folder
 *   - Emptying the Recycle Bin with confirmation
 *   - Permanently deleting individual files
 */

import { Icons } from '../icons.js';
import { FileSystem } from '../filesystem.js';
import { WindowManager } from '../windowManager.js';
import { SoundManager } from '../soundManager.js';

export const RecycleBinApp = {

    async open() {
        const id = 'recycle-bin';

        const win = WindowManager.createWindow({
            id,
            title: 'Recycle Bin',
            icon: Icons.recycleBin,
            width: 580,
            height: 400,
            content: `
                <div class="recycle-container" id="${id}-container" style="display:flex;flex-direction:column;height:100%;background:#c0c0c0;user-select:none;">
                    <div class="app-menubar">
                        <span class="app-menu-item menu-empty-btn">Empty Recycle Bin</span>
                        <span class="app-menu-item menu-restore-btn">Restore Selected</span>
                        <span class="app-menu-item menu-delete-btn">Delete Selected</span>
                    </div>

                    <div class="app-toolbar">
                        <button class="app-toolbar-btn btn-empty"><img src="${Icons.recycleBin}" alt=""> Empty Bin</button>
                        <button class="app-toolbar-btn btn-restore"><img src="${Icons.folderOpen}" alt=""> Restore Item</button>
                        <button class="app-toolbar-btn btn-delete"><img src="${Icons.shutdownIcon}" alt=""> Delete</button>
                    </div>

                    <!-- Details Table Header -->
                    <div style="display:grid;grid-template-columns:180px 180px 100px 1fr;background:#c0c0c0;border-bottom:1px solid #808080;font-size:11px;font-weight:bold;padding:2px 4px;">
                        <div style="border-right:1px solid #fff;padding:2px 4px;">Name</div>
                        <div style="border-right:1px solid #fff;padding:2px 4px;">Original Location</div>
                        <div style="border-right:1px solid #fff;padding:2px 4px;">Date Deleted</div>
                        <div style="padding:2px 4px;">Size</div>
                    </div>

                    <!-- Item List View -->
                    <div class="recycle-list" style="flex:1;background:#fff;overflow-y:auto;font-size:11px;"></div>
                </div>
            `
        });

        this.initRecycleBinLogic(win, id);
        return win;
    },

    initRecycleBinLogic(win, id) {
        const container = win.querySelector(`#${id}-container`);
        if (!container) return;

        const listView = container.querySelector('.recycle-list');
        const statusText = win.querySelector('.window-statusbar-text');
        let selectedItem = null;
        let selectedData = null;

        const renderList = async () => {
            selectedItem = null;
            selectedData = null;
            listView.innerHTML = '';

            try {
                const items = await FileSystem.listRecycleBin();

                if (items.length === 0) {
                    listView.innerHTML = '<div style="padding:20px;text-align:center;color:#808080;font-style:italic;">The Recycle Bin is empty.</div>';
                    if (statusText) statusText.textContent = '0 object(s)';
                    return;
                }

                let totalSize = 0;

                items.forEach(item => {
                    totalSize += (item.size || 0);

                    const row = document.createElement('div');
                    row.style.cssText = 'display:grid;grid-template-columns:180px 180px 100px 1fr;padding:3px 4px;cursor:pointer;border-bottom:1px solid #f0f0f0;align-items:center;';
                    row.dataset.id = item.id;

                    const dateStr = item.modified ? new Date(item.modified).toLocaleDateString() : 'Unknown';
                    const origLoc = item.deletedFrom || 'C:/';

                    let iconImg = Icons.fileGeneric;
                    if (item.type === 'folder') iconImg = Icons.folder;
                    else if (item.name.endsWith('.txt')) iconImg = Icons.fileText;
                    else if (item.name.match(/\.(png|bmp|jpg|jpeg|gif)$/i)) iconImg = Icons.fileImage;

                    row.innerHTML = `
                        <div style="display:flex;align-items:center;gap:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                            <img src="${iconImg}" style="width:16px;height:16px;image-rendering:pixelated;" alt="">
                            <span>${item.name}</span>
                        </div>
                        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#555;">${origLoc}</div>
                        <div style="color:#555;">${dateStr}</div>
                        <div style="color:#555;">${FileSystem.formatSize(item.size || 0)}</div>
                    `;

                    row.addEventListener('click', () => {
                        if (selectedItem) {
                            selectedItem.style.background = 'transparent';
                            selectedItem.style.color = '#000';
                        }
                        selectedItem = row;
                        selectedData = item;
                        row.style.background = '#0a246a';
                        row.style.color = '#fff';
                        if (statusText) statusText.textContent = `1 object(s) selected (${FileSystem.formatSize(item.size || 0)})`;
                    });

                    listView.appendChild(row);
                });

                if (statusText) {
                    statusText.textContent = `${items.length} object(s)  |  Total: ${FileSystem.formatSize(totalSize)}`;
                }
            } catch (err) {
                listView.innerHTML = `<div style="padding:10px;color:red;">Error reading Recycle Bin: ${err.message}</div>`;
            }
        };

        const playTrash = () => {
            if (typeof SoundManager !== 'undefined' && SoundManager.playTrash) SoundManager.playTrash();
            else if (window.SoundManager && window.SoundManager.playTrash) window.SoundManager.playTrash();
        };

        const playChord = () => {
            if (typeof SoundManager !== 'undefined' && SoundManager.playChord) SoundManager.playChord();
            else if (window.SoundManager && window.SoundManager.playChord) window.SoundManager.playChord();
        };

        const doEmptyBin = () => {
            WindowManager.showDialog({
                title: 'Confirm File Delete',
                message: 'Are you sure you want to permanently delete all items in the Recycle Bin?',
                icon: '🗑️',
                buttons: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                ],
                onButton: async (val) => {
                    if (val === 'yes') {
                        await FileSystem.emptyRecycleBin();
                        playTrash();
                        renderList();
                    }
                }
            });
        };

        const doRestoreSelected = async () => {
            if (!selectedData) {
                WindowManager.showDialog({
                    title: 'Recycle Bin',
                    message: 'Please select an item to restore.',
                    icon: 'ℹ️'
                });
                return;
            }

            try {
                await FileSystem.restoreEntry(selectedData.id);
                playChord();
                renderList();
            } catch (err) {
                WindowManager.showDialog({
                    title: 'Restore Error',
                    message: `Could not restore item: ${err.message}`,
                    icon: '⚠️'
                });
            }
        };

        const doDeleteSelected = () => {
            if (!selectedData) {
                WindowManager.showDialog({
                    title: 'Recycle Bin',
                    message: 'Please select an item to delete.',
                    icon: 'ℹ️'
                });
                return;
            }

            WindowManager.showDialog({
                title: 'Confirm Delete',
                message: `Are you sure you want to permanently delete "${selectedData.name}"?`,
                icon: '❓',
                buttons: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                ],
                onButton: async (val) => {
                    if (val === 'yes') {
                        await FileSystem.permanentDelete(selectedData.id);
                        playTrash();
                        renderList();
                    }
                }
            });
        };

        // Wire toolbar and menubar
        container.querySelector('.btn-empty').addEventListener('click', doEmptyBin);
        container.querySelector('.menu-empty-btn').addEventListener('click', doEmptyBin);

        container.querySelector('.btn-restore').addEventListener('click', doRestoreSelected);
        container.querySelector('.menu-restore-btn').addEventListener('click', doRestoreSelected);

        container.querySelector('.btn-delete').addEventListener('click', doDeleteSelected);
        container.querySelector('.menu-delete-btn').addEventListener('click', doDeleteSelected);

        // Initial render
        renderList();
    }
};

window.RecycleBinApp = RecycleBinApp;
