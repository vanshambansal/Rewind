import { Icons } from './icons.js';
import { Desktop } from './desktop.js';
import { WindowManager } from './windowManager.js';
import { SoundManager } from './soundManager.js';

// Start menu items configuration
const MENU_ITEMS = [
    { id: 'my-computer',   label: 'My Computer',   icon: Icons.myComputer },
    { id: 'my-documents',  label: 'My Documents',  icon: Icons.myDocuments },
    'separator',
    { id: 'notepad',       label: 'Notepad',        icon: Icons.notepad },
    { id: 'calculator',    label: 'Calculator',      icon: Icons.calculator },
    'separator',
    { id: 'control-panel', label: 'Control Panel',   icon: Icons.controlPanel },
    'separator',
    { id: 'shutdown',      label: 'Shut Down...',    icon: Icons.shutdownIcon },
];

let isOpen = false;

function toggle() {
    isOpen = !isOpen;
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-button');
    if (menu) menu.classList.toggle('open', isOpen);
    if (btn) btn.classList.toggle('active', isOpen);
}

function close() {
    if (!isOpen) return;
    isOpen = false;
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-button');
    if (menu) menu.classList.remove('open');
    if (btn) btn.classList.remove('active');
}

function handleShutdown() {
    WindowManager.showDialog({
        title: 'Shut Down',
        message: 'Are you sure you want to shut down the computer?',
        icon: '❓',
        buttons: [
            { label: 'OK', value: 'ok' },
            { label: 'Cancel', value: 'cancel' },
        ],
        onButton(value) {
            if (value === 'ok') {
                const screen = document.getElementById('shutdown-screen');
                if (screen) screen.classList.add('active');
            }
        }
    });
}

export const StartMenu = {

    init() {
        const itemsContainer = document.getElementById('start-menu-items');
        if (!itemsContainer) return;

        itemsContainer.innerHTML = '';

        MENU_ITEMS.forEach(item => {
            if (item === 'separator') {
                const sep = document.createElement('div');
                sep.className = 'start-menu-separator';
                itemsContainer.appendChild(sep);
                return;
            }

            const div = document.createElement('div');
            div.className = 'start-menu-item';
            div.innerHTML = `
                <img src="${item.icon}" alt="">
                <span>${item.label}</span>
            `;

            div.addEventListener('click', () => {
                SoundManager.playClick();
                close();
                if (item.id === 'shutdown') {
                    handleShutdown();
                } else {
                    Desktop.openApp(item.id);
                }
            });

            itemsContainer.appendChild(div);
        });

        // Toggle on Start button click
        const startBtn = document.getElementById('start-button');
        if (startBtn) {
            startBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                SoundManager.playClick();
                toggle();
            });
        }

        // Close when clicking anywhere outside
        document.addEventListener('mousedown', (e) => {
            if (!e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
                close();
            }
        });
    },

    close
};
