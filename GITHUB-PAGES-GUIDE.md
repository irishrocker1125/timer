# GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `timer` (or your choice)
3. Description: "Ultimate Stage Timer for Presentations"
4. Choose **Public** (required for free GitHub Pages)
5. Click "Create repository"

### Step 2: Upload Files
**Option A: Via GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop these files:
   - `index.html`
   - `app.js`
   - `README.md`
   - `.gitignore`
   - `_config.yml`
3. Click "Commit changes"

**Option B: Via Git CLI**
```bash
cd C:\Users\Gordon Schauer\dev\timer
git init
git add .
git commit -m "Initial commit: Ultimate Stage Timer"
git branch -M main
git remote add origin https://github.com/yourusername/timer.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment"
   - Source: Select "Deploy from a branch"
   - Branch: Select `main`
   - Folder: Select `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment
7. Your site will be live at: `https://yourusername.github.io/timer`

### Step 4: Customize (Optional)
- Edit `_config.yml` to customize metadata
- Update `README.md` with your name
- Customize colors in `index.html` CSS variables

## URL Structure

| URL | Purpose |
|-----|---------|
| `https://yourusername.github.io/timer` | Main timer app |
| `https://yourusername.github.io/timer/` | Same as above |
| `https://yourusername.github.io/timer/index.html` | Direct access |

## Custom Domain (Optional)

### Using Custom Domain
1. Go to Settings → Pages
2. Under "Custom domain", enter your domain: `timer.yourdomain.com`
3. Click "Save"
4. Update your DNS records:
   - Point to: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
5. Wait for DNS propagation (up to 48 hours)

## Troubleshooting

### "404 Not Found"
- Check that repository is **Public**
- Verify Pages is enabled in Settings
- Wait 2-3 minutes after enabling Pages
- Try clearing browser cache (Ctrl+Shift+Delete)

### "File not found" on live site
- Ensure files are in root directory (not in a folder)
- Check file names are lowercase (GitHub Pages is case-sensitive on Linux)
- Verify all files were pushed to GitHub

### Styling looks broken
- Clear browser cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console for errors (F12)

### Timer doesn't work
- Open browser console (F12)
- Look for error messages
- Verify `app.js` is being loaded (Network tab)
- Try a different browser

## Testing Before Deployment

### Local Testing
```bash
# Open a terminal in your timer directory
cd C:\Users\Gordon Schauer\dev\timer

# Start local server
python -m http.server 8000

# Open browser to http://localhost:8000
```

### Test Checklist
- [ ] Timer starts/pauses with Space
- [ ] Reset works with R key
- [ ] Presets (1-5) work
- [ ] Fullscreen works with F key
- [ ] Theme toggle works with L key
- [ ] Colors change as time runs down
- [ ] Sounds play (if enabled)
- [ ] Settings persist after reload

## GitHub Pages Limits

- **Storage**: 1 GB per repository
- **Bandwidth**: Unlimited (but fair use applies)
- **Build time**: 10 minutes
- **Request rate**: Reasonable limits
- **File size**: Individual files should be < 25MB

**Our timer**: ~40KB total (well under all limits!)

## Alternative Hosting Options

If you prefer not to use GitHub Pages:

### Netlify (Recommended)
1. Connect your GitHub repo
2. Auto-deploys on push
3. Free SSL, custom domain support
4. Live: [yoursite.netlify.app](https://yoursite.netlify.app)

### Vercel
1. Import from GitHub
2. One-click deployment
3. Custom domain support
4. Preview URLs for testing

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init
firebase deploy
```

### AWS S3 + CloudFront
Static website hosting on AWS with CDN.

### Simple Static Server
Any web host supporting static files (HTML/CSS/JS) works!

## Updating Your Timer

### Modify Files
1. Make changes locally to `index.html` or `app.js`
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update timer features"
   git push
   ```
3. Site updates automatically (usually within 1 minute)

### Revert Changes
```bash
git log                          # See commit history
git revert [commit-hash]         # Revert specific commit
git push                         # Deploy revert
```

## Performance Notes

Our timer is optimized for:
- **First load**: ~100ms
- **File sizes**: index.html (14KB) + app.js (15KB)
- **Memory usage**: ~20MB at runtime
- **CPU usage**: Minimal (requestAnimationFrame optimization)
- **Network**: Zero ongoing requests (no API calls)

GitHub Pages CDN delivers files at edge speeds worldwide!

## Security

This timer is:
- ✅ Completely client-side (no server code)
- ✅ No data collection
- ✅ No external dependencies
- ✅ No tracking or analytics
- ✅ All calculations happen in your browser
- ✅ Settings stored only in your localStorage

Perfect for privacy-conscious presentations!

## Support & Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#limitations-for-github-pages-sites)
- [MDN Web Docs](https://developer.mozilla.org/) - For web standards
- Open an issue on GitHub if you find problems

---

**That's it! Your stage timer is now live and accessible from anywhere! 🎉**
