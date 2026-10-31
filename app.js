class StageTimer {
    constructor() {
        this.timerSeconds = 0;
        this.stopwatchMs = 0;
        this.baseCountdownSeconds = 300;
        this.isRunning = false;
        this.currentMode = 'countdown';
        this.lastUpdateTime = Date.now();
        this.animationFrameId = null;
        this.lastMilestoneAlert = null;
        this.lastFlashTime = 0;

        this.itemCount = 0;
        this.voteCount = 0;
        this.tallyCount = 0;

        this.presets = [
            { label: '5m', seconds: 300 },
            { label: '10m', seconds: 600 },
            { label: '15m', seconds: 900 },
            { label: '30m', seconds: 1800 },
            { label: '1h', seconds: 3600 }
        ];

        this.settings = {
            warningLevel: 60,
            criticalLevel: 10,
            enableColor: true,
            enableSound: true,
            enableFlash: true,
            enableMilestones: true,
            autoReset: false
        };

        this.loadSettings();
        this.initializeUI();
        this.attachEventListeners();
        this.startAnimationLoop();
    }

    initializeUI() {
        this.parseDuration();
        this.applySavedSession();

        const container = document.getElementById('presetsContainer');
        this.presets.forEach((preset, idx) => {
            const btn = document.createElement('button');
            btn.className = 'preset-btn';
            btn.textContent = preset.label;
            btn.dataset.seconds = preset.seconds;
            btn.dataset.index = idx;
            btn.addEventListener('click', () => this.setPresetDuration(preset.seconds));
            container.appendChild(btn);
        });

        this.updateModeLabel();
        this.updateRunStateUI();
        this.syncPresetActive();
        this.updateDisplay();
    }

    attachEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTimer());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('lightModeBtn').addEventListener('click', () => this.toggleTheme());
        document.getElementById('repeatLastBtn').addEventListener('click', () => this.repeatLastSetup());
        document.getElementById('clearStateBtn').addEventListener('click', () => this.clearSavedSetup());
        document.querySelectorAll('.adjust-btn').forEach((button) => {
            button.addEventListener('click', () => {
                this.adjustDuration(parseInt(button.dataset.adjust, 10));
            });
        });

        document.getElementById('timerMode').addEventListener('change', (e) => this.changeMode(e.target.value));
        document.getElementById('durationInput').addEventListener('change', () => {
            this.parseDuration();
            this.persistSessionState();
        });
        document.getElementById('warningLevel').addEventListener('change', (e) => {
            this.settings.warningLevel = parseInt(e.target.value);
            this.saveSettings();
        });
        document.getElementById('criticalLevel').addEventListener('change', (e) => {
            this.settings.criticalLevel = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('colorWarning').addEventListener('change', (e) => {
            this.settings.enableColor = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('soundWarning').addEventListener('change', (e) => {
            this.settings.enableSound = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('flashWarning').addEventListener('change', (e) => {
            this.settings.enableFlash = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('milestoneAlerts').addEventListener('change', (e) => {
            this.settings.enableMilestones = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('autoReset').addEventListener('change', (e) => {
            this.settings.autoReset = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('itemCounter').addEventListener('change', (e) => {
            this.itemCount = parseInt(e.target.value) || 0;
            this.persistSessionState();
        });
        document.getElementById('voteCounter').addEventListener('change', (e) => {
            this.voteCount = parseInt(e.target.value) || 0;
            this.persistSessionState();
        });
        document.getElementById('tallyCounter').addEventListener('change', (e) => {
            this.tallyCount = parseInt(e.target.value) || 0;
            this.persistSessionState();
        });

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        const tagName = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
        if (tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
            return;
        }
        const key = e.key.toUpperCase();

        if (key === ' ') {
            e.preventDefault();
            this.toggleTimer();
        } else if (key === 'R') {
            this.resetTimer();
        } else if (key === 'F') {
            e.preventDefault();
            this.toggleFullscreen();
        } else if (key === 'L') {
            this.toggleTheme();
        } else if (key === 'ESCAPE') {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        } else if (key >= '1' && key <= '5') {
            const idx = parseInt(key) - 1;
            if (idx < this.presets.length) {
                this.setPresetDuration(this.presets[idx].seconds);
            }
        } else if (key === '-' || key === '_') {
            this.adjustDuration(-10);
        } else if (key === '+' || key === '=') {
            this.adjustDuration(10);
        }
    }

    changeMode(mode) {
        this.currentMode = mode;
        this.isRunning = false;
        if (mode === 'countdown') {
            this.timerSeconds = this.baseCountdownSeconds;
        } else {
            this.timerSeconds = 0;
        }
        this.stopwatchMs = 0;
        this.lastMilestoneAlert = null;
        this.updateModeLabel();
        this.updateRunStateUI();

        const counterDisplay = document.getElementById('counterDisplay');
        const adjustRow = document.getElementById('adjustRow');
        const durationInput = document.getElementById('durationInput');
        if (['items', 'votes', 'tally'].includes(mode)) {
            counterDisplay.classList.remove('hidden');
            adjustRow.classList.add('hidden');
            durationInput.disabled = true;
        } else {
            counterDisplay.classList.add('hidden');
            durationInput.disabled = false;
            if (mode === 'countdown') {
                adjustRow.classList.remove('hidden');
            } else {
                adjustRow.classList.add('hidden');
            }
        }

        this.persistSessionState();
        this.updateDisplay();
    }

    parseDuration() {
        const input = document.getElementById('durationInput').value.trim();
        const parts = input.split(':');
        let durationSeconds = this.timerSeconds;

        if (parts.length === 2) {
            const mins = parseInt(parts[0], 10) || 0;
            const secs = parseInt(parts[1], 10) || 0;
            durationSeconds = mins * 60 + secs;
        } else if (parts.length === 3) {
            const hours = parseInt(parts[0], 10) || 0;
            const mins = parseInt(parts[1], 10) || 0;
            const secs = parseInt(parts[2], 10) || 0;
            durationSeconds = (hours * 3600) + (mins * 60) + secs;
        }
        this.baseCountdownSeconds = Math.max(0, Math.floor(durationSeconds));
        if (this.currentMode === 'countdown') {
            this.timerSeconds = this.baseCountdownSeconds;
        }
        document.getElementById('durationInput').value = this.formatClock(this.baseCountdownSeconds);
        this.syncPresetActive();
        this.updateDisplay();
    }

    updateModeLabel() {
        const modeMap = {
            'countdown': 'COUNTDOWN',
            'stopwatch': 'STOPWATCH',
            'items': 'ITEM COUNTER',
            'votes': 'VOTE COUNTER',
            'tally': 'TALLY COUNTER'
        };
        document.getElementById('modeLabel').textContent = modeMap[this.currentMode] || 'TIMER';
    }

    toggleTimer() {
        if (this.currentMode === 'countdown' || this.currentMode === 'stopwatch') {
            this.isRunning = !this.isRunning;
            if (!this.isRunning && this.currentMode === 'countdown' && this.timerSeconds <= 0) {
                this.timerSeconds = this.baseCountdownSeconds;
            }
            this.updateRunStateUI();
            this.lastUpdateTime = Date.now();
            this.persistSessionState();
        }
    }

    resetTimer() {
        this.isRunning = false;
        this.timerSeconds = this.currentMode === 'countdown' ? this.baseCountdownSeconds : 0;
        this.stopwatchMs = 0;
        this.lastMilestoneAlert = null;
        this.updateRunStateUI();
        this.persistSessionState();
        this.syncPresetActive();
        this.updateDisplay();
    }

    setPresetDuration(seconds) {
        this.baseCountdownSeconds = Math.max(0, Math.floor(seconds));
        this.timerSeconds = this.baseCountdownSeconds;
        this.isRunning = false;
        this.lastMilestoneAlert = null;
        this.updateRunStateUI();
        document.getElementById('durationInput').value = this.formatClock(this.baseCountdownSeconds);

        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-seconds="${seconds}"]`)?.classList.add('active');

        this.persistSessionState();
        this.updateDisplay();
    }

    adjustDuration(deltaSeconds) {
        if (this.currentMode !== 'countdown' || this.isRunning) return;
        this.baseCountdownSeconds = Math.max(0, this.baseCountdownSeconds + deltaSeconds);
        this.timerSeconds = this.baseCountdownSeconds;
        document.getElementById('durationInput').value = this.formatClock(this.baseCountdownSeconds);
        this.syncPresetActive();
        this.persistSessionState();
        this.updateDisplay();
    }

    updateDisplay() {
        const display = document.getElementById('timerDisplay');

        if (this.currentMode === 'countdown') {
            display.textContent = this.formatClock(this.timerSeconds);
            this.updateTimerColor();
        } else if (this.currentMode === 'stopwatch') {
            display.textContent = this.formatStopwatch(this.stopwatchMs);
            display.className = 'timer-display';
        } else if (['items', 'votes', 'tally'].includes(this.currentMode)) {
            const counters = {
                'items': this.itemCount,
                'votes': this.voteCount,
                'tally': this.tallyCount
            };
            display.textContent = counters[this.currentMode];
            display.className = 'timer-display';
        }

        this.updateMetrics();
    }

    formatClock(secondsInput) {
        const seconds = Math.max(0, Math.floor(secondsInput));
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    formatStopwatch(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateTimerColor() {
        const display = document.getElementById('timerDisplay');
        display.classList.remove('warning', 'critical');

        if (!this.settings.enableColor) {
            display.className = 'timer-display';
            return;
        }

        if (this.timerSeconds <= this.settings.criticalLevel && this.timerSeconds > 0) {
            display.classList.add('critical');
        } else if (this.timerSeconds <= this.settings.warningLevel && this.timerSeconds > 0) {
            display.classList.add('warning');
        } else {
            display.className = 'timer-display';
        }
    }

    checkMilestones(previousSeconds, currentSeconds) {
        if (!this.settings.enableMilestones) return;

        const milestones = [600, 300, 60, 0];
        for (const milestone of milestones) {
            const crossedMilestone = milestone === 0
                ? previousSeconds > 0 && currentSeconds <= 0
                : previousSeconds >= milestone && currentSeconds < milestone;
            if (crossedMilestone && this.lastMilestoneAlert !== milestone) {
                this.lastMilestoneAlert = milestone;
                if (milestone === 0 && this.settings.enableSound) {
                    this.playSound('finished');
                } else if (milestone > 0 && this.settings.enableSound) {
                    this.playSound('alert');
                }
                if (this.settings.enableFlash && milestone > 0) {
                    this.flashScreen();
                }
            }
        }
    }

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);

            if (type === 'alert') {
                oscillator.frequency.value = 800;
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else if (type === 'finished') {
                oscillator.frequency.value = 1200;
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }
        } catch (e) {
            console.log('Audio context not available');
        }
    }

    flashScreen() {
        if (Date.now() - this.lastFlashTime < 500) return;
        this.lastFlashTime = Date.now();
        document.body.classList.add('flashing');
        setTimeout(() => document.body.classList.remove('flashing'), 300);
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isDark = !document.body.classList.contains('light-mode');
        document.getElementById('lightModeBtn').textContent = isDark ? '🌙 Dark' : '☀️ Light';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen request failed:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    startAnimationLoop() {
        const update = () => {
            const now = Date.now();
            const deltaTime = (now - this.lastUpdateTime) / 1000;
            this.lastUpdateTime = now;

            if (this.isRunning) {
                if (this.currentMode === 'countdown') {
                    const previousSeconds = this.timerSeconds;
                    this.timerSeconds = Math.max(0, this.timerSeconds - deltaTime);
                    this.checkMilestones(previousSeconds, this.timerSeconds);

                    if (this.timerSeconds <= 0) {
                        this.isRunning = false;
                        this.updateRunStateUI(true);
                        if (this.settings.autoReset) {
                            this.timerSeconds = this.baseCountdownSeconds;
                            this.updateRunStateUI();
                        }
                    }
                } else if (this.currentMode === 'stopwatch') {
                    this.stopwatchMs += deltaTime * 1000;
                }
            }

            this.updateDisplay();
            this.animationFrameId = requestAnimationFrame(update);
        };

        this.animationFrameId = requestAnimationFrame(update);
    }

    saveSettings() {
        localStorage.setItem('timerSettings', JSON.stringify(this.settings));
    }

    persistSessionState() {
        const state = {
            mode: this.currentMode,
            duration: this.baseCountdownSeconds,
            itemCount: this.itemCount,
            voteCount: this.voteCount,
            tallyCount: this.tallyCount
        };
        localStorage.setItem('timerSessionState', JSON.stringify(state));
    }

    applySavedSession() {
        const saved = localStorage.getItem('timerSessionState');
        if (!saved) return;
        try {
            const state = JSON.parse(saved);
            if (state.mode) {
                document.getElementById('timerMode').value = state.mode;
                this.currentMode = state.mode;
            }
            if (Number.isFinite(state.duration)) {
                this.baseCountdownSeconds = Math.max(0, Math.floor(state.duration));
                this.timerSeconds = this.baseCountdownSeconds;
                document.getElementById('durationInput').value = this.formatClock(this.baseCountdownSeconds);
            }
            this.itemCount = Number.isFinite(state.itemCount) ? state.itemCount : 0;
            this.voteCount = Number.isFinite(state.voteCount) ? state.voteCount : 0;
            this.tallyCount = Number.isFinite(state.tallyCount) ? state.tallyCount : 0;
            document.getElementById('itemCounter').value = this.itemCount;
            document.getElementById('voteCounter').value = this.voteCount;
            document.getElementById('tallyCounter').value = this.tallyCount;
            this.changeMode(this.currentMode);
        } catch (e) {
            console.log('Invalid saved session state');
        }
    }

    repeatLastSetup() {
        this.applySavedSession();
        this.resetTimer();
    }

    clearSavedSetup() {
        localStorage.removeItem('timerSessionState');
    }

    updateRunStateUI(forceFinished = false) {
        const statusLabel = document.getElementById('statusLabel');
        const startBtn = document.getElementById('startBtn');

        if (forceFinished) {
            statusLabel.textContent = 'FINISHED';
            statusLabel.style.background = 'var(--danger)';
            startBtn.classList.remove('btn-pause');
            startBtn.classList.add('btn-start');
            startBtn.textContent = '▶ Start';
            return;
        }

        if (this.isRunning) {
            statusLabel.textContent = 'RUNNING';
            statusLabel.style.background = 'var(--danger)';
            startBtn.classList.remove('btn-start');
            startBtn.classList.add('btn-pause');
            startBtn.textContent = '⏸ Pause';
        } else {
            const isPausedCountdown = this.currentMode === 'countdown' && this.timerSeconds > 0 && this.timerSeconds < this.baseCountdownSeconds;
            const isPausedStopwatch = this.currentMode === 'stopwatch' && this.stopwatchMs > 0;
            statusLabel.textContent = (isPausedCountdown || isPausedStopwatch) ? 'PAUSED' : 'READY';
            statusLabel.style.background = 'var(--warning)';
            startBtn.classList.remove('btn-pause');
            startBtn.classList.add('btn-start');
            startBtn.textContent = '▶ Start';
        }
    }

    syncPresetActive() {
        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        const activePreset = document.querySelector(`[data-seconds="${this.baseCountdownSeconds}"]`);
        if (activePreset && this.currentMode === 'countdown') {
            activePreset.classList.add('active');
        }
    }

    updateMetrics() {
        const remainingValue = document.getElementById('remainingValue');
        const elapsedValue = document.getElementById('elapsedValue');
        const nextAlertValue = document.getElementById('nextAlertValue');
        const progressFill = document.getElementById('progressFill');

        if (this.currentMode === 'countdown') {
            const remaining = Math.max(0, Math.floor(this.timerSeconds));
            const elapsed = Math.max(0, this.baseCountdownSeconds - remaining);
            remainingValue.textContent = this.formatClock(remaining);
            elapsedValue.textContent = this.formatClock(elapsed);

            let nextAlert = 'None';
            if (remaining > this.settings.warningLevel) {
                nextAlert = this.formatClock(this.settings.warningLevel);
            } else if (remaining > this.settings.criticalLevel) {
                nextAlert = this.formatClock(this.settings.criticalLevel);
            } else if (remaining > 0) {
                nextAlert = '00:00';
            }
            nextAlertValue.textContent = nextAlert;

            const percent = this.baseCountdownSeconds > 0
                ? (remaining / this.baseCountdownSeconds) * 100
                : 0;
            progressFill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
        } else if (this.currentMode === 'stopwatch') {
            const elapsed = Math.floor(this.stopwatchMs / 1000);
            remainingValue.textContent = '—';
            elapsedValue.textContent = this.formatClock(elapsed);
            nextAlertValue.textContent = 'Manual';
            progressFill.style.width = '100%';
        } else {
            remainingValue.textContent = '—';
            elapsedValue.textContent = '—';
            nextAlertValue.textContent = 'Counter';
            progressFill.style.width = '100%';
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('timerSettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.log('Invalid saved settings');
            }
        }

        const theme = localStorage.getItem('theme');
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            document.getElementById('lightModeBtn').textContent = '☀️ Light';
        }

        document.getElementById('warningLevel').value = this.settings.warningLevel;
        document.getElementById('criticalLevel').value = this.settings.criticalLevel;
        document.getElementById('colorWarning').checked = this.settings.enableColor;
        document.getElementById('soundWarning').checked = this.settings.enableSound;
        document.getElementById('flashWarning').checked = this.settings.enableFlash;
        document.getElementById('milestoneAlerts').checked = this.settings.enableMilestones;
        document.getElementById('autoReset').checked = this.settings.autoReset;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new StageTimer();
});
