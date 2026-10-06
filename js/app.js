import { Desktop } from './desktop.js';
import { Taskbar } from './taskbar.js';
import { StartMenu } from './startMenu.js';
import { ContextMenu } from './contextMenu.js';
import { WindowManager } from './windowManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize OS modules
    Taskbar.init();
    Desktop.init();
    StartMenu.init();
    ContextMenu.init();

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + F4 -> Close active window
        if (e.altKey && e.key === 'F4') {
            e.preventDefault();
            WindowManager.closeActiveWindow();
        }

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
