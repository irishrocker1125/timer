# 🎭 Ultimate Stage Timer

A professional, fully-featured stage timer web application designed for speakers, presenters, and event organizers. Runs completely on GitHub Pages with no build process needed.

## ✨ Features

### Timer Modes
- **Countdown Timer** - Classic presentation timer counting down to zero
- **Stopwatch** - Count upward from zero (MM:SS format)
- **Counters** - Item, Vote, and Tally counters for interactive presentations

### Display & Visibility
- 🔤 **Extra-Large Font** (180px+) - Readable from 20+ feet away
- 📊 **Professional Dark/Light Theme** - Toggle between modes
- ⛶ **Fullscreen Mode** - Dedicated stage display
- 🎨 **High Contrast** - Designed for projection and distance viewing
- 📱 **Responsive Design** - Works on any screen size

### Smart Warnings
- 🟢 **Color Changes** - Green → Yellow (warning) → Red (critical)
- 🔊 **Audio Alerts** - Sounds at key milestones (10min, 5min, 1min, finish)
- ⚡ **Screen Flash** - Visual flash alerts when critical
- 📢 **Customizable Thresholds** - Set warning and critical levels

### Controls
| Action | Keyboard | Mouse |
|--------|----------|-------|
| Start/Pause | `Space` | Click START button |
| Reset | `R` | Click RESET button |
| Fullscreen | `F` | Click ⛶ button |
| Toggle Theme | `L` | Click 🌙 button |
| Preset Times | `1-5` | Click preset buttons |
| Exit Fullscreen | `ESC` | ESC key |

### Quick Presets
- **5m** - Short discussion (Press 1)
- **10m** - Standard segment (Press 2)
- **15m** - Extended talk (Press 3)
- **30m** - Half hour (Press 4)
- **1h** - Full hour (Press 5)

### Settings (All Tweakable)
- Duration input (MM:SS format)
- Warning level threshold (seconds)
- Critical level threshold (seconds)
- Enable/disable color warnings
- Enable/disable sound effects
- Enable/disable screen flash
- Enable/disable milestone alerts

### Performance Optimized
- ⚡ **Smooth 60fps** animations using requestAnimationFrame
- 💾 **Persistent Settings** - Saves preferences to localStorage
- 🎯 **Minimal Jank** - Optimized rendering and calculations
- 📦 **Zero Dependencies** - Pure HTML/CSS/JavaScript

## 🚀 Quick Start

### Option 1: Local Use
1. Clone or download this repository
2. Open `index.html` in any web browser
3. Start timing!

### Option 2: GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose `main` branch and `/root` folder
5. Visit `yourusername.github.io/timer`

### Option 3: Deploy to Custom Domain
Use your favorite static hosting (Vercel, Netlify, etc.) - just upload the files!

## 📋 Modes Explained

### Countdown Mode
Perfect for presentations. Set your duration and watch it count down with visual warnings as time runs out.

### Stopwatch Mode
Track elapsed time for activities, exercises, or demonstrations. Stopwatch runs HH:MM:SS.

### Counter Modes
- **Items** - Count objects, slides, or segments
- **Votes** - Track voting results
- **Tally** - Keep a running tally

## ⚙️ Customization Tips

### For Live Presentations
1. Set warning level to 5 minutes (300s)
2. Set critical level to 1 minute (60s)
3. Enable all warnings for maximum visibility
4. Use fullscreen mode on stage monitor

### For Workshops
1. Use 30-minute segments with 5-minute warnings
2. Enable milestone alerts for 10min/5min/1min
3. Use stopwatch for tracking activity time

### For Events
1. Use presets matching your agenda blocks
2. Disable sound if using audio system
3. Customize colors for your brand theme

## 🎨 Styling Guide

The timer uses CSS custom properties for easy theming:

```css
--primary: #1a1a2e      /* Background */
--success: #00d084      /* Green (normal) */
--warning: #ffd700      /* Yellow (warning) */
--danger: #ff4757       /* Red (critical) */
```

## 📱 Accessibility
- Large text sizes (accessible to those with vision impairments)
- High contrast colors (meets WCAG AA standards)
- Keyboard navigation (no mouse required)
- Reduced motion support (respects prefers-reduced-motion)

## 🔧 Technical Details

**File Structure:**
- `index.html` - HTML structure and CSS styling
- `app.js` - Complete JavaScript application logic
- `README.md` - Documentation

**Browser Support:**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Any modern browser with Web Audio API support

**Storage:**
- Uses localStorage for settings persistence
- No server required
- All data stored locally

## 🎯 Best Practices

1. **Before your presentation:** Test the timer on your actual display
2. **For readability:** Position monitor 6-10 feet away from presenter view
3. **Audio testing:** Check audio levels in your venue before going live
4. **Backup timing:** Have a backup phone timer as failsafe
5. **Theme testing:** Verify colors work with your presentation backdrop

## 📝 Keyboard Shortcuts Reference

```
SPACE   → Start/Pause the timer
R       → Reset to initial value
F       → Enter/exit fullscreen mode
L       → Toggle between dark/light theme
1-5     → Quick preset (5m, 10m, 15m, 30m, 1h)
ESC     → Exit fullscreen mode
```

## 🤝 Contributing

Found a bug or have a feature request? Feel free to open an issue or submit a pull request!

## 📄 License

MIT License - Use freely in personal and commercial projects.

## 💡 Tips & Tricks

- **Pro Tip 1:** Run fullscreen on your stage monitor while using regular view on your laptop
- **Pro Tip 2:** Use custom durations for exact segment lengths
- **Pro Tip 3:** Set warning level just before your target ending time
- **Pro Tip 4:** Disable sound and use flash if you need silent alerts
- **Pro Tip 5:** Dark mode is easier on the eyes during live events

---

**Made for presenters, by presenters.** Enjoy smooth, distraction-free timing! ⏱️
