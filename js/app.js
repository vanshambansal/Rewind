import { Desktop } from './desktop.js';
import { Taskbar } from './taskbar.js';
import { StartMenu } from './startMenu.js';
import { ContextMenu } from './contextMenu.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize OS modules
    Taskbar.init();
    Desktop.init();
    StartMenu.init();
    ContextMenu.init();

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Windows key or Ctrl+Esc to toggle Start menu
        if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) {
            e.preventDefault();
            const startBtn = document.getElementById('start-button');
            if (startBtn) startBtn.click();
        }

        // Escape to close menus
        if (e.key === 'Escape') {
            StartMenu.close();
            ContextMenu.close();
        }
    });

    // Suppress default browser right-click menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
