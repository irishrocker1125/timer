class StageTimer {
    constructor() {
        this.timerSeconds = 0;
        this.stopwatchMs = 0;
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
            enableMilestones: true
        };

        this.loadSettings();
        this.initializeUI();
        this.attachEventListeners();
        this.startAnimationLoop();
    }

    initializeUI() {
        // Set initial duration
        this.parseDuration();

        // Create preset buttons
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

        this.updateDisplay();
    }

    attachEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.toggleTimer());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTimer());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('lightModeBtn').addEventListener('click', () => this.toggleTheme());

        document.getElementById('timerMode').addEventListener('change', (e) => this.changeMode(e.target.value));
        document.getElementById('durationInput').addEventListener('change', () => this.parseDuration());
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

        // Counter inputs
        document.getElementById('itemCounter').addEventListener('change', (e) => {
            this.itemCount = parseInt(e.target.value) || 0;
        });
        document.getElementById('voteCounter').addEventListener('change', (e) => {
            this.voteCount = parseInt(e.target.value) || 0;
        });
        document.getElementById('tallyCounter').addEventListener('change', (e) => {
            this.tallyCount = parseInt(e.target.value) || 0;
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
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
        }
    }

    changeMode(mode) {
        this.currentMode = mode;
        this.isRunning = false;
        this.timerSeconds = 0;
        this.stopwatchMs = 0;
        this.lastMilestoneAlert = null;
        this.updateModeLabel();

        const counterDisplay = document.getElementById('counterDisplay');
        if (mode.includes('Counter') || ['items', 'votes', 'tally'].includes(mode)) {
            counterDisplay.style.display = 'grid';
        } else {
            counterDisplay.style.display = 'none';
        }

        this.updateDisplay();
    }

    parseDuration() {
        const input = document.getElementById('durationInput').value.trim();
        const parts = input.split(':');
        if (parts.length === 2) {
            const mins = parseInt(parts[0]) || 0;
            const secs = parseInt(parts[1]) || 0;
            this.timerSeconds = mins * 60 + secs;
        }
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
            const status = this.isRunning ? 'RUNNING' : 'PAUSED';
            document.getElementById('statusLabel').textContent = status;
            document.getElementById('statusLabel').style.background = this.isRunning ? 'var(--danger)' : 'var(--warning)';
            this.lastUpdateTime = Date.now();
        }
    }

    resetTimer() {
        this.isRunning = false;
        this.timerSeconds = 0;
        this.stopwatchMs = 0;
        this.lastMilestoneAlert = null;
        document.getElementById('statusLabel').textContent = 'READY';
        document.getElementById('statusLabel').style.background = 'var(--warning)';
        this.updateDisplay();
    }

    setPresetDuration(seconds) {
        this.timerSeconds = seconds;
        this.isRunning = false;
        this.lastMilestoneAlert = null;
        document.getElementById('statusLabel').textContent = 'READY';
        document.getElementById('statusLabel').style.background = 'var(--warning)';
        document.getElementById('durationInput').value = this.formatTimer(seconds);

        document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-seconds="${seconds}"]`)?.classList.add('active');

        this.updateDisplay();
    }

    updateDisplay() {
        const display = document.getElementById('timerDisplay');

        if (this.currentMode === 'countdown') {
            display.textContent = this.formatTimer(this.timerSeconds);
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
    }

    formatTimer(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
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

    checkMilestones() {
        if (!this.settings.enableMilestones) return;

        const milestones = [600, 300, 60, 0]; // 10m, 5m, 1m, 0s
        for (const milestone of milestones) {
            if (this.timerSeconds === milestone && this.lastMilestoneAlert !== milestone) {
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
        if (Date.now() - this.lastFlashTime < 500) return; // Debounce flashes
        this.lastFlashTime = Date.now();
        
        document.body.classList.add('flashing');
        setTimeout(() => document.body.classList.remove('flashing'), 300);
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isDark = !document.body.classList.contains('light-mode');
        document.getElementById('lightModeBtn').textContent = isDark ? '🌙 DARK' : '☀️ LIGHT';
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
                    this.timerSeconds = Math.max(0, this.timerSeconds - deltaTime);
                    
                    if (this.timerSeconds === 0 && this.isRunning) {
                        this.isRunning = false;
                        document.getElementById('statusLabel').textContent = 'FINISHED';
                        document.getElementById('statusLabel').style.background = 'var(--danger)';
                        this.checkMilestones();
                    }
                    
                    this.checkMilestones();
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

    loadSettings() {
        const saved = localStorage.getItem('timerSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }

        // Restore theme
        const theme = localStorage.getItem('theme');
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            document.getElementById('lightModeBtn').textContent = '☀️ LIGHT';
        }

        // Update settings UI
        document.getElementById('warningLevel').value = this.settings.warningLevel;
        document.getElementById('criticalLevel').value = this.settings.criticalLevel;
        document.getElementById('colorWarning').checked = this.settings.enableColor;
        document.getElementById('soundWarning').checked = this.settings.enableSound;
        document.getElementById('flashWarning').checked = this.settings.enableFlash;
        document.getElementById('milestoneAlerts').checked = this.settings.enableMilestones;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new StageTimer();
});
