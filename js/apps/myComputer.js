/**
 * myComputer.js — File Explorer application for browsing virtual folders and files.
 */

import { Icons } from '../icons.js';
import { FileSystem } from '../filesystem.js';
import { WindowManager } from '../windowManager.js';
import { NotepadApp } from './notepad.js';

export const MyComputerApp = {

    /**
     * Open File Explorer at a specific directory path.
     * @param {string} initialPath e.g. "C:" or "C:/My Documents"
     * @param {string} [windowId] Optional window identifier
     */
    async open(initialPath = 'C:', windowId = null) {
        const id = windowId || (initialPath === 'C:' ? 'my-computer' : `explorer-${Date.now()}`);
        const title = initialPath === 'C:' ? 'My Computer' : (FileSystem.getFileName(initialPath) || 'Explorer');
        const icon = initialPath === 'C:' ? Icons.myComputer : Icons.folder;

        const win = WindowManager.createWindow({
            id,
            title,
            icon,
            width: 620,
            height: 440,
            content: `
                <div class="explorer-container" id="${id}-container" tabindex="0" style="outline:none;">
                    <div class="app-menubar">
                        <span class="app-menu-item menu-new-folder-btn">New Folder</span>
                        <span class="app-menu-item menu-rename-btn">Rename</span>
                        <span class="app-menu-item menu-delete-file-btn">Delete</span>
                        <span class="app-menu-item menu-refresh-btn">Refresh</span>
                    </div>
                    <div class="app-toolbar">
                        <button class="app-toolbar-btn btn-back" title="Back"><img src="${Icons.navBack}" alt=""> Back</button>
                        <button class="app-toolbar-btn btn-forward" title="Forward"><img src="${Icons.navForward}" alt=""> Forward</button>
                        <button class="app-toolbar-btn btn-up" title="Up one level"><img src="${Icons.navUp}" alt=""> Up</button>
                        <div class="app-toolbar-sep"></div>
                        <button class="app-toolbar-btn btn-new-folder" title="New Folder"><img src="${Icons.folder}" alt=""> New Folder</button>
                        <button class="app-toolbar-btn btn-rename-item" title="Rename selected item"><img src="${Icons.fileText}" alt=""> Rename</button>
                        <button class="app-toolbar-btn btn-delete-item" title="Delete selected item"><img src="${Icons.shutdownIcon}" alt=""> Delete</button>
                    </div>
                    <div class="app-addressbar">
                        <span class="app-addressbar-label">Address</span>
                        <div class="app-addressbar-input-wrap">
                            <img class="app-addressbar-icon address-icon" src="${icon}" alt="">
                            <input type="text" class="app-addressbar-input" readonly>
                        </div>
                    </div>
                    <div class="explorer-view"></div>
                </div>
            `
        });

        this.initExplorerLogic(win, id, initialPath);
        return win;
    },

    initExplorerLogic(win, id, startPath) {
        const container = win.querySelector(`#${id}-container`);
        if (!container) return;

        const view = container.querySelector('.explorer-view');
        const addressInput = container.querySelector('.app-addressbar-input');
        const addressIcon = container.querySelector('.address-icon');
        const statusText = win.querySelector('.window-statusbar-text');
        const titleText = win.querySelector('.window-titlebar-text');

        const btnBack = container.querySelector('.btn-back');
        const btnForward = container.querySelector('.btn-forward');
        const btnUp = container.querySelector('.btn-up');
        const btnNewFolder = container.querySelector('.btn-new-folder');
        const btnRenameItem = container.querySelector('.btn-rename-item');
        const btnDeleteItem = container.querySelector('.btn-delete-item');

        let currentPath = startPath;
        const history = [startPath];
        let historyIndex = 0;
        let selectedItemEl = null;
        let selectedItemData = null;

        const updateButtons = () => {
            btnBack.disabled = historyIndex <= 0;
            btnForward.disabled = historyIndex >= history.length - 1;
            btnUp.disabled = (currentPath === 'C:' || !FileSystem.getParentPath(currentPath));
        };

        const renderDirectory = async (path) => {
            currentPath = path;
            selectedItemEl = null;
            selectedItemData = null;
            addressInput.value = path.replace(/\//g, '\\');
            addressIcon.src = (path === 'C:') ? Icons.myComputer : Icons.folder;
            titleText.textContent = (path === 'C:') ? 'My Computer' : (FileSystem.getFileName(path) || 'Explorer');

            updateButtons();
            view.innerHTML = '';

            try {
                let items = await FileSystem.listDirectory(path);

                if (items.length === 0) {
                    view.innerHTML = '<div class="explorer-empty">This folder is empty.</div>';
                    if (statusText) statusText.textContent = '0 object(s)';
                    return;
                }

                let totalSize = 0;

                items.forEach(item => {
                    totalSize += (item.size || 0);
                    const div = document.createElement('div');
                    div.className = 'explorer-item';
                    div.dataset.path = item.path;
                    div.dataset.type = item.type;

                    let itemIcon = Icons.fileGeneric;
                    if (item.type === 'folder') {
                        itemIcon = Icons.folder;
                    } else if (item.name.endsWith('.txt')) {
                        itemIcon = Icons.fileText;
                    } else if (item.name.match(/\.(png|bmp|jpg|jpeg|gif)$/i)) {
                        itemIcon = Icons.fileImage;
                    } else if (item.name.match(/\.(mp3|wav|ogg)$/i)) {
                        itemIcon = Icons.fileAudio;
                    }

                    div.innerHTML = `
                        <img class="explorer-item-icon" src="${itemIcon}" alt="">
                        <span class="explorer-item-name">${item.name}</span>
                    `;

                    // Single click selection
                    div.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (typeof SoundManager !== 'undefined' && SoundManager.playClick) SoundManager.playClick();
                        else if (window.SoundManager && window.SoundManager.playClick) window.SoundManager.playClick();
                        if (selectedItemEl) selectedItemEl.classList.remove('selected');
                        selectedItemEl = div;
                        selectedItemData = item;
                        div.classList.add('selected');
                        if (statusText) {
                            if (item.type === 'folder') {
                                statusText.textContent = `1 object(s) selected (Folder)`;
                            } else {
                                statusText.textContent = `1 object(s) selected (${FileSystem.formatSize(item.size)})`;
                            }
                        }
                    });

                    // Double click open
                    div.addEventListener('dblclick', async (e) => {
                        e.stopPropagation();
                        if (item.type === 'folder') {
                            navigateTo(item.path);
                        } else if (item.name.endsWith('.txt')) {
                            NotepadApp.open(item.path);
                        } else if (item.name.match(/\.(png|bmp|jpg|jpeg|gif)$/i)) {
                            if (window.PaintApp) {
                                window.PaintApp.open(item.path);
                            }
                        }
                    });

                    view.appendChild(div);
                });

                if (statusText) {
                    statusText.textContent = `${items.length} object(s) (Disk: ${FileSystem.formatSize(totalSize)})`;
                }
            } catch (err) {
                view.innerHTML = `<div class="explorer-empty">Error reading directory: ${err.message}</div>`;
            }
        };

        const navigateTo = (path, addHistory = true) => {
            if (addHistory) {
                history.splice(historyIndex + 1);
                history.push(path);
                historyIndex = history.length - 1;
            }
            renderDirectory(path);
        };

        const doDeleteSelected = () => {
            if (!selectedItemData) {
                WindowManager.showDialog({
                    title: 'Delete Item',
                    message: 'Please select a file or folder to delete.',
                    icon: 'ℹ️'
                });
                return;
            }

            WindowManager.showDialog({
                title: 'Confirm Delete',
                message: `Are you sure you want to send "${selectedItemData.name}" to the Recycle Bin?`,
                icon: '🗑️',
                buttons: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' }
                ],
                onButton: async (val) => {
                    if (val === 'yes') {
                        try {
                            await FileSystem.deleteEntry(selectedItemData.path);
                            if (typeof SoundManager !== 'undefined' && SoundManager.playTrash) SoundManager.playTrash();
                            else if (window.SoundManager && window.SoundManager.playTrash) window.SoundManager.playTrash();
                            renderDirectory(currentPath);
                        } catch (err) {
                            WindowManager.showDialog({
                                title: 'Error',
                                message: `Could not delete item: ${err.message}`,
                                icon: '⚠️'
                            });
                        }
                    }
                }
            });
        };

        const doRenameSelected = () => {
            if (!selectedItemData) {
                WindowManager.showDialog({
                    title: 'Rename',
                    message: 'Please select a file or folder to rename.',
                    icon: 'ℹ️'
                });
                return;
            }

            WindowManager.showPrompt({
                title: 'Rename Item',
                message: `Enter new name for "${selectedItemData.name}":`,
                defaultValue: selectedItemData.name,
                icon: '✏️',
                onOk: async (newName) => {
                    if (!newName || newName === selectedItemData.name) return;
                    try {
                        await FileSystem.renameEntry(selectedItemData.path, newName);
                        renderDirectory(currentPath);
                    } catch (err) {
                        WindowManager.showDialog({
                            title: 'Rename Error',
                            message: `Could not rename: ${err.message}`,
                            icon: '⚠️'
                        });
                    }
                }
            });
        };

        const doCreateFolder = () => {
            WindowManager.showPrompt({
                title: 'New Folder',
                message: 'Enter folder name:',
                defaultValue: 'New Folder',
                icon: '📁',
                onOk: async (name) => {
                    try {
                        const folderName = await FileSystem.getUniqueName(currentPath, name || 'New Folder');
                        await FileSystem.createFolder(currentPath, folderName);
                        renderDirectory(currentPath);
                    } catch (err) {
                        WindowManager.showDialog({
                            title: 'Error',
                            message: `Could not create folder: ${err.message}`,
                            icon: '⚠️'
                        });
                    }
                }
            });
        };

        // Navigation toolbar events
        btnBack.addEventListener('click', () => {
            if (historyIndex > 0) {
                historyIndex--;
                renderDirectory(history[historyIndex]);
            }
        });

        btnForward.addEventListener('click', () => {
            if (historyIndex < history.length - 1) {
                historyIndex++;
                renderDirectory(history[historyIndex]);
            }
        });

        btnUp.addEventListener('click', () => {
            const parent = FileSystem.getParentPath(currentPath);
            if (parent) navigateTo(parent);
        });

        btnNewFolder.addEventListener('click', doCreateFolder);
        btnRenameItem.addEventListener('click', doRenameSelected);
        btnDeleteItem.addEventListener('click', doDeleteSelected);

        container.querySelector('.menu-new-folder-btn').addEventListener('click', doCreateFolder);
        container.querySelector('.menu-rename-btn').addEventListener('click', doRenameSelected);
        container.querySelector('.menu-delete-file-btn').addEventListener('click', doDeleteSelected);
        container.querySelector('.menu-refresh-btn').addEventListener('click', () => renderDirectory(currentPath));

        // Keyboard Shortcuts
        win.addEventListener('keydown', (e) => {
            if (e.key === 'Delete') {
                e.preventDefault();
                doDeleteSelected();
            } else if (e.key === 'F2') {
                e.preventDefault();
                doRenameSelected();
            } else if (e.key === 'F5') {
                e.preventDefault();
                renderDirectory(currentPath);
            }
        });

        // Click outside items to deselect
        view.addEventListener('click', (e) => {
            if (e.target === view || e.target.classList.contains('explorer-empty')) {
                if (selectedItemEl) selectedItemEl.classList.remove('selected');
                selectedItemEl = null;
                selectedItemData = null;
                const itemsCount = view.querySelectorAll('.explorer-item').length;
                if (statusText) statusText.textContent = `${itemsCount} object(s)`;
            }
        });

        // Initial render
        renderDirectory(startPath);
    }
};

window.MyComputerApp = MyComputerApp;
