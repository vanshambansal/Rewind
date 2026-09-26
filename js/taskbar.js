import { Icons } from './icons.js';

const taskButtons = new Map();
let activeTrayPopup = null;

function closeTrayPopups() {
    if (activeTrayPopup) {
        activeTrayPopup.classList.remove('open');
        activeTrayPopup = null;
    }
}

export const Taskbar = {

    init() {
        // Set Start button icon
        const startIcon = document.getElementById('start-button-icon');
        if (startIcon) {
            startIcon.src = Icons.startIcon;
        }

        // Set sound icon in system tray
        const soundIcon = document.getElementById('tray-sound');
        if (soundIcon) {
            soundIcon.src = Icons.soundOn;
        }

        // Create tray popups (Calendar)
        this.createTrayPopups();

        // Clicking clock toggles calendar popup
        const clockEl = document.getElementById('tray-clock');
        if (clockEl) {
            clockEl.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCalendarPopup();
            });
        }

        // Close tray popups when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tray-popup') && !e.target.closest('#system-tray')) {
                closeTrayPopups();
            }
        });

        // Start live clock ticking every second
        this.updateClock();
        this._clockInterval = setInterval(() => this.updateClock(), 1000);
    },

    createTrayPopups() {
        const calendarPopup = document.createElement('div');
        calendarPopup.className = 'tray-popup tray-calendar-popup';
        document.body.appendChild(calendarPopup);
        this.renderCalendarPopup(calendarPopup);
    },

    renderCalendarPopup(container) {
        const now = new Date();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let daysHtml = '';
        // Empty cells before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            daysHtml += '<div style="padding:2px 4px;color:#aaa;"></div>';
        }
        // Fill days of current month
        for (let d = 1; d <= daysInMonth; d++) {
            const isToday = d === today;
            const bg = isToday ? '#0a246a' : 'transparent';
            const col = isToday ? '#fff' : '#000';
            daysHtml += `<div style="padding:3px;text-align:center;background:${bg};color:${col};font-weight:${isToday ? 'bold' : 'normal'};border-radius:2px;">${d}</div>`;
        }

        container.innerHTML = `
            <div style="padding:10px;display:flex;flex-direction:column;gap:6px;min-width:210px;user-select:none;">
                <div style="font-weight:bold;text-align:center;color:#0a246a;font-size:12px;">${monthNames[month]} ${year}</div>
                <div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:2px;font-size:11px;font-weight:bold;text-align:center;border-bottom:1px solid #808080;padding-bottom:3px;">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:2px;font-size:11px;">
                    ${daysHtml}
                </div>
                <div style="border-top:1px solid #fff;border-bottom:1px solid #808080;margin:2px 0;"></div>
                <div style="font-size:11px;text-align:center;color:#404040;" class="tray-cal-clock">${now.toLocaleTimeString()}</div>
            </div>
        `;
    },

    toggleCalendarPopup() {
        const el = document.querySelector('.tray-calendar-popup');
        if (activeTrayPopup === el) {
            closeTrayPopups();
        } else {
            closeTrayPopups();
            this.renderCalendarPopup(el);
            el.classList.add('open');
            activeTrayPopup = el;
        }
    },

    updateClock() {
        const el = document.getElementById('tray-clock');
        if (!el) return;

        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        el.textContent = `${hours}:${minutes} ${ampm}`;
        el.title = now.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const calClock = document.querySelector('.tray-cal-clock');
        if (calClock) {
            calClock.textContent = now.toLocaleTimeString();
        }
    },

    addTaskButton(id, title, icon, onClick) {
        const container = document.getElementById('task-buttons');
        if (!container) return;

        const btn = document.createElement('button');
        btn.className = 'task-button active';
        btn.dataset.windowId = id;

        const iconHtml = icon ? `<img class="task-button-icon" src="${icon}" alt="">` : '';
        btn.innerHTML = `${iconHtml}<span class="task-button-label">${title}</span>`;

        btn.addEventListener('click', () => {
            if (onClick) onClick();
        });

        container.appendChild(btn);
        taskButtons.set(id, btn);
    },

    removeTaskButton(id) {
        if (taskButtons.has(id)) {
            taskButtons.get(id).remove();
            taskButtons.delete(id);
        }
    },

    setTaskButtonActive(id, active) {
        if (taskButtons.has(id)) {
            taskButtons.get(id).classList.toggle('active', active);
        }
    },

    setTaskButtonTitle(id, title) {
        if (taskButtons.has(id)) {
            const label = taskButtons.get(id).querySelector('.task-button-label');
            if (label) label.textContent = title;
        }
    }
};
