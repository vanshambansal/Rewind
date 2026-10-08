/**
 * controlPanel.js — Control Panel for system settings.
 *
 * Supports:
 *   - Display properties: Wallpaper selection & custom image upload
 *   - Sound preferences: Enable/disable system sounds with test button
 *   - Date / Time settings & clock display
 */

import { Icons } from '../icons.js';
import { Storage } from '../storage.js';
import { Desktop } from '../desktop.js';
import { WindowManager } from '../windowManager.js';
import { SoundManager } from '../soundManager.js';

const WALLPAPER_PRESETS = [
    { id: 'landscape', name: 'Bliss (Rolling Hills)', url: 'assets/images/wallpapers/landscape.png' },
    { id: 'teal', name: 'Classic Teal (Solid)', color: '#008080' },
    { id: 'classic-blue', name: 'Windows Blue (Solid)', color: '#0a246a' },
    { id: 'midnight', name: 'Midnight (Dark)', color: '#16192b' },
];

export const ControlPanelApp = {

    open() {
        const id = 'control-panel';

        const win = WindowManager.createWindow({
            id,
            title: 'Control Panel',
            icon: Icons.controlPanel,
            width: 460,
            height: 420,
            content: `
                <div class="controlpanel-container" id="${id}-container" style="display:flex;flex-direction:column;height:100%;background:#c0c0c0;padding:8px;font-size:11px;user-select:none;box-sizing:border-box;">
                    <!-- Tabs -->
                    <div style="display:flex;gap:2px;margin-bottom:0;z-index:2;">
                        <button class="cp-tab-btn active" data-tab="display" style="padding:3px 8px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:none;cursor:pointer;font-weight:bold;">Display</button>
                        <button class="cp-tab-btn" data-tab="sounds" style="padding:3px 8px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:none;cursor:pointer;">Sounds</button>
                        <button class="cp-tab-btn" data-tab="datetime" style="padding:3px 8px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:none;cursor:pointer;">Date & Time</button>
                        <button class="cp-tab-btn" data-tab="system" style="padding:3px 8px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:none;cursor:pointer;">System</button>
                    </div>

                    <!-- Tab Content Panel -->
                    <div style="flex:1;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;padding:12px;margin-top:-1px;display:flex;flex-direction:column;">
                        <!-- Display Tab -->
                        <div class="cp-tab-content tab-display" style="display:flex;flex-direction:column;height:100%;gap:10px;">
                            <div style="display:flex;gap:14px;align-items:center;">
                                <!-- Retro CRT Monitor Preview Box -->
                                <div style="width:140px;height:100px;background:#c0c0c0;border:3px solid #808080;border-radius:4px;padding:4px;display:flex;flex-direction:column;align-items:center;box-shadow:inset 1px 1px #fff;">
                                    <div class="cp-wallpaper-preview" style="width:100%;height:80px;background:#008080;background-size:cover;background-position:center;border:1px solid #000;"></div>
                                    <div style="width:20px;height:6px;background:#808080;margin-top:2px;"></div>
                                </div>

                                <div style="flex:1;">
                                    <label style="font-weight:bold;display:block;margin-bottom:4px;">Select Wallpaper:</label>
                                    <select class="cp-wallpaper-select" style="width:100%;padding:2px;font-family:inherit;font-size:11px;background:#fff;border-top:1px solid #808080;border-left:1px solid #808080;border-right:1px solid #fff;border-bottom:1px solid #fff;margin-bottom:8px;">
                                        <option value="landscape">Bliss (Rolling Hills)</option>
                                        <option value="teal">Classic Teal (Solid)</option>
                                        <option value="classic-blue">Windows Blue (Solid)</option>
                                        <option value="midnight">Midnight (Dark)</option>
                                        <option value="custom">Custom Image...</option>
                                    </select>

                                    <div style="display:flex;align-items:center;gap:6px;">
                                        <label class="cp-btn" style="background:#c0c0c0;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #404040;border-bottom:1px solid #404040;padding:3px 8px;cursor:pointer;display:inline-block;text-align:center;">
                                            Browse...
                                            <input type="file" class="cp-file-input" accept="image/*" style="display:none;">
                                        </label>
                                        <span class="cp-custom-label" style="color:#555;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:110px;"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sounds Tab -->
                        <div class="cp-tab-content tab-sounds" style="display:none;flex-direction:column;gap:12px;">
                            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                                <input type="checkbox" class="cp-sound-toggle" style="cursor:pointer;">
                                <span style="font-weight:bold;">Enable System Sound Effects</span>
                            </label>
                            <p style="color:#555;line-height:1.4;">Plays nostalgic clicks, chords, alerts, and retro game audio effects synthesized with Web Audio.</p>
                            <div>
                                <button class="cp-test-sound-btn" style="background:#c0c0c0;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #404040;border-bottom:1px solid #404040;padding:4px 12px;cursor:pointer;">🔊 Play Test Sound</button>
                            </div>
                        </div>

                        <!-- Date & Time Tab -->
                        <div class="cp-tab-content tab-datetime" style="display:none;flex-direction:column;gap:10px;align-items:center;justify-content:center;height:100%;">
                            <div style="font-size:24px;font-weight:bold;color:#000080;font-family:'Courier New', monospace;" class="cp-live-clock">12:00:00 PM</div>
                            <div style="font-size:13px;color:#333;" class="cp-live-date">Friday, August 21, 2026</div>
                            <div style="font-size:11px;color:#777;">Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'System Local'}</div>
                        </div>

                        <!-- System Tab -->
                        <div class="cp-tab-content tab-system" style="display:none;flex-direction:column;gap:12px;height:100%;box-sizing:border-box;">
                            <div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;border-bottom:1px solid #808080;">
                                <div style="font-size:32px;">🖥️</div>
                                <div>
                                    <div style="font-weight:bold;font-size:12px;color:#0a246a;">Rewind 98 Operating System</div>
                                    <div style="color:#555;">Second Edition</div>
                                </div>
                            </div>
                            <div style="line-height:1.8;color:#222;flex:1;padding-top:4px;">
                                <div><strong>Registered to:</strong> Vansham Bansal</div>
                                <div><strong>Computer:</strong> Personal Computer</div>
                                <div><strong>System Type:</strong> Web-based Desktop Simulation</div>
                                <div><strong>Installed Tools:</strong> My Computer, Notepad, Calculator, Control Panel, Recycle Bin</div>
                            </div>
                            <div style="border-top:1px solid #fff;border-bottom:1px solid #808080;margin:4px 0;"></div>
                            <div style="display:flex;justify-content:flex-end;align-items:center;">
                                <a href="system.html" style="background:#c0c0c0;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #404040;border-bottom:1px solid #404040;padding:4px 12px;cursor:pointer;text-decoration:none;color:#000;font-weight:bold;display:inline-flex;align-items:center;gap:4px;box-shadow:1px 1px 0 #000;">
                                    <span>View System Details ↗</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Action Buttons -->
                    <div style="display:flex;justify-content:flex-end;gap:6px;margin-top:8px;">
                        <button class="cp-btn-ok" style="background:#c0c0c0;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #404040;border-bottom:1px solid #404040;min-width:64px;height:22px;cursor:pointer;font-weight:bold;">OK</button>
                        <button class="cp-btn-cancel" style="background:#c0c0c0;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #404040;border-bottom:1px solid #404040;min-width:64px;height:22px;cursor:pointer;">Cancel</button>
                    </div>
                </div>
            `
        });

        this.initControlPanelLogic(win, id);
        return win;
    },

    initControlPanelLogic(win, id) {
        const container = win.querySelector(`#${id}-container`);
        if (!container) return;

        // Tabs handling
        const tabBtns = container.querySelectorAll('.cp-tab-btn');
        const tabContents = container.querySelectorAll('.cp-tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.fontWeight = 'normal';
                });
                tabContents.forEach(c => c.style.display = 'none');

                btn.classList.add('active');
                btn.style.fontWeight = 'bold';
                const tabName = btn.dataset.tab;
                container.querySelector(`.tab-${tabName}`).style.display = 'flex';
            });
        });

        // ── Display / Wallpaper ──────────────────────────────────
        const select = container.querySelector('.cp-wallpaper-select');
        const preview = container.querySelector('.cp-wallpaper-preview');
        const fileInput = container.querySelector('.cp-file-input');
        const customLabel = container.querySelector('.cp-custom-label');

        let selectedWallpaper = Storage.getSetting('wallpaper_preset', 'landscape');
        let customDataUrl = Storage.getSetting('wallpaper_custom', null);

        select.value = selectedWallpaper;

        const updatePreview = () => {
            const val = select.value;
            if (val === 'custom' && customDataUrl) {
                preview.style.backgroundColor = 'transparent';
                preview.style.backgroundImage = `url('${customDataUrl}')`;
            } else {
                const preset = WALLPAPER_PRESETS.find(p => p.id === val);
                if (preset) {
                    if (preset.url) {
                        preview.style.backgroundColor = 'transparent';
                        preview.style.backgroundImage = `url('${preset.url}')`;
                    } else {
                        preview.style.backgroundImage = 'none';
                        preview.style.backgroundColor = preset.color;
                    }
                }
            }
        };

        updatePreview();

        select.addEventListener('change', () => {
            updatePreview();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            customLabel.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (ev) => {
                customDataUrl = ev.target.result;
                select.value = 'custom';
                updatePreview();
            };
            reader.readAsDataURL(file);
        });

        const applyWallpaper = () => {
            const val = select.value;
            const desktop = document.getElementById('desktop');
            if (val === 'custom' && customDataUrl) {
                desktop.style.backgroundColor = 'transparent';
                desktop.style.backgroundImage = `url('${customDataUrl}')`;
                Storage.setSetting('wallpaper_preset', 'custom');
                Storage.setSetting('wallpaper_custom', customDataUrl);
            } else {
                const preset = WALLPAPER_PRESETS.find(p => p.id === val);
                if (preset) {
                    if (preset.url) {
                        desktop.style.backgroundColor = 'transparent';
                        desktop.style.backgroundImage = `url('${preset.url}')`;
                    } else {
                        desktop.style.backgroundImage = 'none';
                        desktop.style.backgroundColor = preset.color;
                    }
                    Storage.setSetting('wallpaper_preset', preset.id);
                }
            }
        };

        // ── Sound Settings ───────────────────────────────────────
        const isSoundEnabled = () => {
            if (typeof SoundManager !== 'undefined' && SoundManager.isEnabled) return SoundManager.isEnabled();
            if (window.SoundManager && window.SoundManager.isEnabled) return window.SoundManager.isEnabled();
            return Storage.getSetting('sound_enabled', true);
        };

        const setSoundEnabled = (val) => {
            Storage.setSetting('sound_enabled', !!val);
            if (typeof SoundManager !== 'undefined' && SoundManager.setEnabled) SoundManager.setEnabled(val);
            else if (window.SoundManager && window.SoundManager.setEnabled) window.SoundManager.setEnabled(val);
        };

        const playTestSound = () => {
            if (typeof SoundManager !== 'undefined' && SoundManager.playChord) SoundManager.playChord();
            else if (window.SoundManager && window.SoundManager.playChord) window.SoundManager.playChord();
        };

        const playClickSound = () => {
            if (typeof SoundManager !== 'undefined' && SoundManager.playClick) SoundManager.playClick();
            else if (window.SoundManager && window.SoundManager.playClick) window.SoundManager.playClick();
        };

        const soundToggle = container.querySelector('.cp-sound-toggle');
        soundToggle.checked = isSoundEnabled();

        soundToggle.addEventListener('change', () => {
            setSoundEnabled(soundToggle.checked);
        });

        container.querySelector('.cp-test-sound-btn').addEventListener('click', () => {
            playTestSound();
        });

        // ── Live Clock ───────────────────────────────────────────
        const clockEl = container.querySelector('.cp-live-clock');
        const dateEl = container.querySelector('.cp-live-date');

        const updateClock = () => {
            const now = new Date();
            if (clockEl) clockEl.textContent = now.toLocaleTimeString();
            if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        };

        updateClock();
        const clockInterval = setInterval(updateClock, 1000);

        // OK and Cancel buttons
        container.querySelector('.cp-btn-ok').addEventListener('click', () => {
            applyWallpaper();
            setSoundEnabled(soundToggle.checked);
            playClickSound();
            WindowManager.closeWindow(id);
        });

        const cancelBtn = container.querySelector('.cp-btn-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                playClickSound();
                WindowManager.closeWindow(id);
            });
        }

        // Cleanup clock interval on window close
        const observer = new MutationObserver(() => {
            if (!document.body.contains(win)) {
                clearInterval(clockInterval);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
};

window.ControlPanelApp = ControlPanelApp;
