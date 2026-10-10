import { Taskbar } from './taskbar.js';
import { SoundManager } from './soundManager.js';

let zIndexCounter = 100;
let cascadeOffset = 0;
const OFFSET_STEP = 28;
const MAX_OFFSET = 196;
const windows = new Map();

export const WindowManager = {

    /**
     * Create and display a new application window.
     */
    createWindow({ id, title, icon = null, width = 500, height = 380, content = '', allowMaximize = true }) {
        // If window is already open, just focus or restore it
        if (windows.has(id)) {
            const s = windows.get(id);
            if (s.minimized) this.restoreWindow(id);
            else this.focusWindow(id);
            return s.element;
        }

        // Calculate responsive window dimensions
        const maxAvailW = window.innerWidth;
        const maxAvailH = window.innerHeight - 44; // taskbar height + padding
        const winWidth = Math.min(width, Math.max(220, maxAvailW - 16));
        const winHeight = Math.min(height, Math.max(140, maxAvailH - 16));

        // On mobile / narrow screens (<= 640px), position neatly
        const isMobile = maxAvailW <= 640;
        let left, top;
        if (isMobile) {
            left = Math.max(6, Math.floor((maxAvailW - winWidth) / 2));
            top = Math.max(6, 12);
        } else {
            cascadeOffset = (cascadeOffset + OFFSET_STEP) % MAX_OFFSET;
            left = Math.max(10, Math.min(60 + cascadeOffset, maxAvailW - winWidth - 20));
            top = Math.max(10, Math.min(30 + cascadeOffset, maxAvailH - winHeight - 20));
        }

        // Build window DOM element
        const win = document.createElement('div');
        win.className = 'window focused';
        win.dataset.windowId = id;
        win.style.cssText = `left:${left}px;top:${top}px;width:${winWidth}px;height:${winHeight}px;`;
        zIndexCounter++;
        win.style.zIndex = zIndexCounter;

        const iconImg = icon ? `<img src="${icon}" alt="">` : '';
        const maxBtnHtml = allowMaximize
            ? `<button class="window-btn window-btn-maximize" title="Maximize">\u25A1</button>`
            : `<button class="window-btn window-btn-maximize" title="Maximize" disabled style="opacity:0.3;cursor:default;">\u25A1</button>`;

        win.innerHTML = `
            <div class="window-titlebar">
                <div class="window-titlebar-icon">${iconImg}</div>
                <span class="window-titlebar-text">${title}</span>
                <div class="window-titlebar-buttons">
                    <button class="window-btn window-btn-minimize" title="Minimize">\u2013</button>
                    ${maxBtnHtml}
                    <button class="window-btn window-btn-close" title="Close">\u00D7</button>
                </div>
            </div>
            <div class="window-content">${content}</div>
            <div class="window-statusbar">
                <span class="window-statusbar-text">Ready</span>
            </div>
        `;

        const desktop = document.getElementById('desktop');
        if (desktop) desktop.appendChild(win);

        // Track window state
        const state = {
            element: win,
            title,
            icon,
            allowMaximize,
            minimized: false,
            maximized: false,
            prevBounds: null
        };
        windows.set(id, state);

        // Focus window on click / touch
        win.addEventListener('mousedown', () => this.focusWindow(id));
        win.addEventListener('touchstart', () => this.focusWindow(id), { passive: true });

        // Title bar drag handling (mouse + touch)
        const titlebar = win.querySelector('.window-titlebar');
        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-btn')) return;
            this.startDrag(id, e);
        });
        titlebar.addEventListener('touchstart', (e) => {
            if (e.target.closest('.window-btn')) return;
            this.startDrag(id, e);
        }, { passive: false });

        // Double click title bar to toggle maximize
        if (allowMaximize) {
            titlebar.addEventListener('dblclick', (e) => {
                if (e.target.closest('.window-btn')) return;
                this.toggleMaximize(id);
            });
        }

        // Title bar button listeners
        win.querySelector('.window-btn-minimize').addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(id);
        });

        if (allowMaximize) {
            win.querySelector('.window-btn-maximize').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMaximize(id);
            });
        }

        win.querySelector('.window-btn-close').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(id);
        });

        // Register button in bottom taskbar
        Taskbar.addTaskButton(id, title, icon, () => this.handleTaskButtonClick(id));
        this.focusWindow(id);

        return win;
    },

    closeWindow(id) {
        if (!windows.has(id)) return;
        const state = windows.get(id);

        state.element.remove();
        windows.delete(id);
        Taskbar.removeTaskButton(id);

        this.focusTopWindow();
    },

    minimizeWindow(id) {
        if (!windows.has(id)) return;
        const state = windows.get(id);

        state.element.classList.add('minimized');
        state.element.classList.remove('focused');
        state.minimized = true;

        Taskbar.setTaskButtonActive(id, false);
        this.focusTopWindow();
    },

    restoreWindow(id) {
        if (!windows.has(id)) return;
        const state = windows.get(id);

        state.minimized = false;
        state.element.classList.remove('minimized');
        this.focusWindow(id);
    },

    maximizeWindow(id) {
        if (!windows.has(id)) return;
        const state = windows.get(id);
        if (!state.allowMaximize) return;
        const win = state.element;

        state.prevBounds = {
            left: win.style.left,
            top: win.style.top,
            width: win.style.width,
            height: win.style.height,
        };

        win.classList.add('maximized');
        state.maximized = true;
        win.querySelector('.window-btn-maximize').innerHTML = '&#10064;';
        this.focusWindow(id);
    },

    unmaximizeWindow(id) {
        if (!windows.has(id)) return;
        const state = windows.get(id);
        const win = state.element;

        win.classList.remove('maximized');
        state.maximized = false;
        win.querySelector('.window-btn-maximize').textContent = '\u25A1';

        if (state.prevBounds) {
            win.style.left = state.prevBounds.left;
            win.style.top = state.prevBounds.top;
            win.style.width = state.prevBounds.width;
            win.style.height = state.prevBounds.height;
        }
        this.focusWindow(id);
    },

    toggleMaximize(id) {
        const state = windows.get(id);
        if (!state || !state.allowMaximize) return;
        if (state.maximized) this.unmaximizeWindow(id);
        else this.maximizeWindow(id);
    },

    focusWindow(id) {
        if (!windows.has(id)) return;

        // Unfocus all windows
        for (const [wId, s] of windows) {
            s.element.classList.remove('focused');
            Taskbar.setTaskButtonActive(wId, false);
        }

        // Focus requested window and bump z-index
        const state = windows.get(id);
        zIndexCounter++;
        state.element.style.zIndex = zIndexCounter;
        state.element.classList.add('focused');
        Taskbar.setTaskButtonActive(id, true);
    },

    focusTopWindow() {
        let topWin = null;
        let maxZ = -1;

        for (const [id, s] of windows) {
            if (!s.minimized) {
                const z = parseInt(s.element.style.zIndex, 10) || 0;
                if (z > maxZ) {
                    maxZ = z;
                    topWin = id;
                }
            }
        }
        if (topWin) this.focusWindow(topWin);
    },

    handleTaskButtonClick(id) {
        const state = windows.get(id);
        if (!state) return;

        if (state.minimized) {
            this.restoreWindow(id);
        } else if (state.element.classList.contains('focused')) {
            this.minimizeWindow(id);
        } else {
            this.focusWindow(id);
        }
    },

    closeActiveWindow() {
        for (const [id, state] of windows) {
            if (state.element.classList.contains('focused') && !state.minimized) {
                this.closeWindow(id);
                return;
            }
        }
    },

    startDrag(id, e) {
        const state = windows.get(id);
        if (!state || state.maximized) return;

        const isTouch = e.type.startsWith('touch');
        const point = isTouch ? e.touches[0] : e;
        if (!point) return;

        if (e.cancelable) e.preventDefault();
        const win = state.element;
        const startX = point.clientX;
        const startY = point.clientY;
        const startLeft = win.offsetLeft;
        const startTop = win.offsetTop;

        const onMove = (ev) => {
            const p = ev.type.startsWith('touch') ? ev.touches[0] : ev;
            if (!p) return;
            const rawLeft = startLeft + p.clientX - startX;
            const rawTop = startTop + p.clientY - startY;

            // Clamping so window title bar cannot be dragged off screen
            const minTop = 0;
            const maxTop = window.innerHeight - 68;
            const minLeft = -win.offsetWidth + 100;
            const maxLeft = window.innerWidth - 100;

            win.style.left = Math.max(minLeft, Math.min(maxLeft, rawLeft)) + 'px';
            win.style.top = Math.max(minTop, Math.min(maxTop, rawTop)) + 'px';
        };

        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onUp);
            document.removeEventListener('touchcancel', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onUp);
        document.addEventListener('touchcancel', onUp);
    },

    /**
     * Show a classic retro modal dialog.
     */
    showDialog({ title, message, icon = 'ℹ️', buttons = [{ label: 'OK', value: 'ok' }], onButton = null }) {
        SoundManager.playAlert();
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        const btnHtml = buttons
            .map(b => `<button class="dialog-btn" data-value="${b.value}">${b.label}</button>`)
            .join('');

        overlay.innerHTML = `
            <div class="dialog">
                <div class="dialog-titlebar">
                    <span class="dialog-titlebar-text">${title}</span>
                    <button class="dialog-titlebar-close" title="Close">\u00D7</button>
                </div>
                <div class="dialog-body">
                    <div class="dialog-icon">${icon}</div>
                    <div class="dialog-message">${message}</div>
                </div>
                <div class="dialog-buttons">${btnHtml}</div>
            </div>
        `;

        document.body.appendChild(overlay);

        const close = (value) => {
            overlay.remove();
            if (onButton) onButton(value);
        };

        overlay.querySelector('.dialog-titlebar-close').addEventListener('click', () => close(null));
        overlay.querySelectorAll('.dialog-btn').forEach(btn => {
            btn.addEventListener('click', () => close(btn.dataset.value));
        });

        const first = overlay.querySelector('.dialog-btn');
        if (first) first.focus();
    },

    /**
     * Show a classic retro text input prompt dialog.
     */
    showPrompt({ title, message, defaultValue = '', icon = '📝', onOk = null, onCancel = null }) {
        SoundManager.playAlert();
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';

        overlay.innerHTML = `
            <div class="dialog" style="min-width:340px;">
                <div class="dialog-titlebar">
                    <span class="dialog-titlebar-text">${title}</span>
                    <button class="dialog-titlebar-close" title="Close">\u00D7</button>
                </div>
                <div class="dialog-body" style="flex-direction:column;align-items:flex-start;gap:8px;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        <div class="dialog-icon" style="font-size:24px;">${icon}</div>
                        <div class="dialog-message">${message}</div>
                    </div>
                    <input type="text" class="dialog-input" value="${defaultValue}">
                </div>
                <div class="dialog-buttons">
                    <button class="dialog-btn btn-ok">OK</button>
                    <button class="dialog-btn btn-cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const input = overlay.querySelector('.dialog-input');
        input.focus();
        input.select();

        const close = (confirmed) => {
            const val = input.value.trim();
            overlay.remove();
            if (confirmed && onOk) onOk(val);
            else if (!confirmed && onCancel) onCancel();
        };

        overlay.querySelector('.dialog-titlebar-close').addEventListener('click', () => close(false));
        overlay.querySelector('.btn-cancel').addEventListener('click', () => close(false));
        overlay.querySelector('.btn-ok').addEventListener('click', () => close(true));

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') close(true);
            else if (e.key === 'Escape') close(false);
        });
    }
};
