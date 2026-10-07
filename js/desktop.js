import { Icons } from './icons.js';
import { FileSystem } from './filesystem.js';
import { NotepadApp } from './apps/notepad.js';
import { CalculatorApp } from './apps/calculator.js';
import { MyComputerApp } from './apps/myComputer.js';
import { RecycleBinApp } from './apps/recycleBin.js';

// Desktop icon definitions
const DESKTOP_ICONS = [
    { id: 'my-computer',  label: 'My Computer',  icon: Icons.myComputer },
    { id: 'my-documents', label: 'My Documents', icon: Icons.myDocuments },
    { id: 'notepad',      label: 'Notepad',      icon: Icons.notepad },
    { id: 'calculator',   label: 'Calculator',    icon: Icons.calculator },
    { id: 'recycle-bin',  label: 'Recycle Bin',    icon: Icons.recycleBin },
];

let selectedIcons = new Set();

function selectIcon(el, multi = false) {
    if (!multi) {
        clearSelection();
    }
    if (el) {
        el.classList.add('selected');
        selectedIcons.add(el.dataset.appId);
    }
}

function clearSelection() {
    document.querySelectorAll('.desktop-icon.selected').forEach(i => i.classList.remove('selected'));
    selectedIcons.clear();
}

export const Desktop = {

    async init() {
        await this.renderIcons();
        this.initRubberBandSelection();
    },

    async renderIcons() {
        const container = document.getElementById('desktop-icons');
        if (!container) return;
        container.innerHTML = '';

        // Dynamically choose Recycle Bin icon based on item count
        const count = await FileSystem.getRecycleBinCount().catch(() => 0);
        const recycleIcon = (count > 0) ? Icons.recycleBinFull : Icons.recycleBin;

        DESKTOP_ICONS.forEach(app => {
            const currentIcon = (app.id === 'recycle-bin') ? recycleIcon : app.icon;
            const div = document.createElement('div');
            div.className = 'desktop-icon';
            div.dataset.appId = app.id;
            div.innerHTML = `
                <img class="desktop-icon-img" src="${currentIcon}" alt="${app.label}" draggable="false">
                <span class="desktop-icon-label">${app.label}</span>
            `;

            // Single click to select
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                selectIcon(div, e.ctrlKey || e.shiftKey);
            });

            // Double click to open application
            div.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                clearSelection();
                this.openApp(app.id);
            });

            container.appendChild(div);
        });
    },

    initRubberBandSelection() {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;

        let isSelecting = false;
        let startX = 0, startY = 0;
        let box = null;

        desktop.addEventListener('mousedown', (e) => {
            // Only trigger on empty desktop background, not icons
            if (e.target.id === 'desktop' || e.target.id === 'desktop-icons') {
                clearSelection();
                if (e.button !== 0) return; // Left mouse button only

                isSelecting = true;
                startX = e.clientX;
                startY = e.clientY;

                box = document.createElement('div');
                box.className = 'desktop-selection-box';
                box.style.left = `${startX}px`;
                box.style.top = `${startY}px`;
                box.style.width = '0px';
                box.style.height = '0px';
                desktop.appendChild(box);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isSelecting || !box) return;

            const currentX = e.clientX;
            const currentY = e.clientY;

            const left = Math.min(startX, currentX);
            const top = Math.min(startY, currentY);
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);

            box.style.left = `${left}px`;
            box.style.top = `${top}px`;
            box.style.width = `${width}px`;
            box.style.height = `${height}px`;

            // Check which icons intersect the selection rectangle
            const boxRect = { left, top, right: left + width, bottom: top + height };
            document.querySelectorAll('.desktop-icon').forEach(iconEl => {
                const r = iconEl.getBoundingClientRect();
                const intersects = !(
                    r.right < boxRect.left ||
                    r.left > boxRect.right ||
                    r.bottom < boxRect.top ||
                    r.top > boxRect.bottom
                );
                if (intersects) {
                    iconEl.classList.add('selected');
                    selectedIcons.add(iconEl.dataset.appId);
                } else if (!e.ctrlKey) {
                    iconEl.classList.remove('selected');
                    selectedIcons.delete(iconEl.dataset.appId);
                }
            });
        });

        document.addEventListener('mouseup', () => {
            if (isSelecting) {
                isSelecting = false;
                if (box) {
                    box.remove();
                    box = null;
                }
            }
        });
    },

    refresh() {
        clearSelection();
        this.renderIcons();
    },

    sortIcons(by = 'name') {
        if (by === 'name') {
            DESKTOP_ICONS.sort((a, b) => a.label.localeCompare(b.label));
        } else if (by === 'type') {
            DESKTOP_ICONS.sort((a, b) => a.id.localeCompare(b.id));
        }
        this.renderIcons();
    },

    openApp(appId) {
        if (appId === 'my-computer') {
            MyComputerApp.open('C:', 'my-computer');
            return;
        }
        if (appId === 'my-documents') {
            MyComputerApp.open('C:/My Documents', 'my-documents');
            return;
        }
        if (appId === 'notepad') {
            NotepadApp.open();
            return;
        }
        if (appId === 'calculator') {
            CalculatorApp.open();
            return;
        }
        if (appId === 'recycle-bin') {
            RecycleBinApp.open();
            return;
        }
        console.log(`Launching ${appId}... (App modules will connect in upcoming commits)`);
    }
};
