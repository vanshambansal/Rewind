import { Desktop } from './desktop.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize desktop icons and selection box
    Desktop.init();

    // Suppress default browser right-click menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
