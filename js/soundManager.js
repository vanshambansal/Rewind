/**
 * soundManager.js — Synthesizes nostalgic Windows 98/2000 sound effects via Web Audio API.
 *
 * Provides synthesized sounds:
 *   - playClick: Short subtle sine chirp for UI button & icon clicks
 *   - playChord: Multi-tone arpeggiated chord for startup & confirmations
 *   - playAlert: Dual-frequency alert chime for dialogs and warnings
 *   - playTrash: Filtered white noise burst for emptying trash & file deletion
 *   - playBlip: Retro square-wave blip for slider feedback
 *
 * Zero external audio file dependencies.
 * Persists sound on/off and volume preferences in Storage (LocalStorage).
 */

import { Storage } from './storage.js';

let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

export const SoundManager = {

    isEnabled() {
        return Storage.getSetting('sound_enabled', true);
    },

    setEnabled(enabled) {
        Storage.setSetting('sound_enabled', !!enabled);
    },

    getVolume() {
        return Storage.getSetting('sound_volume', 80);
    },

    setVolume(vol) {
        const safe = Math.max(0, Math.min(100, parseInt(vol, 10) || 80));
        Storage.setSetting('sound_volume', safe);
    },

    getVolumeMultiplier() {
        return (this.getVolume() / 100);
    },

    toggleSound() {
        const next = !this.isEnabled();
        this.setEnabled(next);
        if (next) this.playClick();
        return next;
    },

    // ── Synthesized Sound Effects ─────────────────────────────────

    playClick() {
        if (!this.isEnabled()) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

            const v = 0.12 * this.getVolumeMultiplier();
            gain.gain.setValueAtTime(v, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.03);
        } catch (e) {
            // Audio context not yet initialized or gesture required
        }
    },

    playAlert() {
        if (!this.isEnabled()) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const vm = this.getVolumeMultiplier();
            [440, 660].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                gain.gain.setValueAtTime(0.15 * vm, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + (i * 0.05));
                osc.stop(ctx.currentTime + 0.35);
            });
        } catch (e) {}
    },

    playChord() {
        if (!this.isEnabled()) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const vm = this.getVolumeMultiplier();
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                gain.gain.setValueAtTime(0.1 * vm, ctx.currentTime + (i * 0.08));
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + (i * 0.08));
                osc.stop(ctx.currentTime + 0.8);
            });
        } catch (e) {}
    },

    playTrash() {
        if (!this.isEnabled()) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const bufferSize = Math.floor(ctx.sampleRate * 0.15);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1000, ctx.currentTime);

            const gain = ctx.createGain();
            const v = 0.2 * this.getVolumeMultiplier();
            gain.gain.setValueAtTime(v, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(ctx.currentTime);
        } catch (e) {}
    },

    playBlip(freq = 600) {
        if (!this.isEnabled()) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            const v = 0.06 * this.getVolumeMultiplier();
            gain.gain.setValueAtTime(v, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }
};

window.SoundManager = SoundManager;
