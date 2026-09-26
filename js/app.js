import { Desktop } from './desktop.js';
import { Taskbar } from './taskbar.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize taskbar and clock
    Taskbar.init();

    // Initialize desktop icons and selection box
    Desktop.init();

    // Suppress default browser right-click menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
