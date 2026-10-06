import { Desktop } from './desktop.js';
import { FileSystem } from './filesystem.js';
import { WindowManager } from './windowManager.js';

let isOpen = false;

export const ContextMenu = {

    init() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        // Open custom menu on desktop right-click
        desktop.addEventListener('contextmenu', (e) => {
            // Ignore right-clicks inside windows or taskbar
            if (e.target.closest('.window') || e.target.closest('#taskbar') || e.target.closest('#start-menu')) {
                return;
            }
            e.preventDefault();
            this.open(e.clientX, e.clientY);
        });

        // Close menu when clicking anywhere outside
        document.addEventListener('mousedown', (e) => {
            if (!e.target.closest('#context-menu')) {
                this.close();
            }
        });
    },

    open(x, y) {
        const menu = document.getElementById('context-menu');
        if (!menu) return;

        menu.innerHTML = `
            <div class="context-menu-item" data-action="arrange">
                <span>Arrange Icons</span>
                <span class="menu-arrow">▶</span>
                <div class="context-submenu">
                    <div class="context-menu-item" data-action="sort-name">By Name</div>
                    <div class="context-menu-item" data-action="sort-type">By Type</div>
                </div>
            </div>
            <div class="context-menu-item" data-action="refresh">Refresh</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="new">
                <span>New</span>
                <span class="menu-arrow">▶</span>
                <div class="context-submenu">
                    <div class="context-menu-item" data-action="new-folder">Folder</div>
                    <div class="context-menu-item" data-action="new-doc">Text Document</div>
                </div>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="fullscreen">Full Screen</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="properties" style="font-weight:bold;">Properties</div>
        `;

        // Screen boundary clamping so menu stays inside viewport
        menu.style.display = 'block';
        const menuW = 180;
        const menuH = 190;
        const posX = (x + menuW > window.innerWidth) ? (x - menuW) : x;
        const posY = (y + menuH > window.innerHeight - 38) ? (y - menuH) : y;

        menu.style.left = `${posX}px`;
        menu.style.top = `${posY}px`;
        menu.classList.add('open');
        isOpen = true;

        // Attach action handlers to menu items
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                // Ignore items that just open a submenu
                if (!action || item.querySelector('.context-submenu')) return;

                e.stopPropagation();
                this.handleAction(action);
                this.close();
            });
        });
    },

    handleAction(action) {
        switch (action) {
            case 'refresh':
                Desktop.refresh();
                break;

            case 'fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
                break;

            case 'sort-name':
                Desktop.sortIcons('name');
                break;

            case 'sort-type':
                Desktop.sortIcons('type');
                break;

            case 'new-folder':
                WindowManager.showPrompt({
                    title: 'New Folder',
                    message: 'Enter folder name for Desktop:',
                    defaultValue: 'New Folder',
                    icon: '📁',
                    onOk: async (name) => {
                        try {
                            const safe = await FileSystem.getUniqueName('C:', name || 'New Folder');
                            await FileSystem.createFolder('C:', safe);
                            Desktop.refresh();
                        } catch (err) {
                            WindowManager.showDialog({ title: 'Error', message: err.message, icon: '⚠️' });
                        }
                    }
                });
                break;

            case 'new-doc':
                WindowManager.showPrompt({
                    title: 'New Document',
                    message: 'Enter file name for Desktop:',
                    defaultValue: 'New Text Document.txt',
                    icon: '📄',
                    onOk: async (name) => {
                        try {
                            const safeName = name.endsWith('.txt') ? name : `${name}.txt`;
                            const safe = await FileSystem.getUniqueName('C:', safeName);
                            await FileSystem.createFile('C:', safe, '');
                            Desktop.refresh();
                        } catch (err) {
                            WindowManager.showDialog({ title: 'Error', message: err.message, icon: '⚠️' });
                        }
                    }
                });
                break;

            case 'properties':
                console.log(`Action ${action} triggered (Connecting in upcoming commits)`);
                break;
        }
    },

    close() {
        if (!isOpen) return;
        isOpen = false;
        const menu = document.getElementById('context-menu');
        if (menu) {
            menu.classList.remove('open');
            menu.style.display = 'none';
        }
    }
};
