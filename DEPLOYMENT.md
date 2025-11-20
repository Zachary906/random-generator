# 🌐 Deployment Guide

This guide covers deploying the Pokémon Wheel Spinner to various hosting platforms.

## Quick Deployment Options

### 1. **GitHub Pages** (Free, Recommended)

GitHub Pages automatically deploys your project for free when you push to GitHub.

**Steps:**
1. Push your repository to GitHub
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your site will be live at `https://yourusername.github.io/random-generator`

**GitHub Action Deployment:**
- Automatic deployment workflow is configured in `.github/workflows/deploy.yml`
- Just push code and it deploys automatically

### 2. **Vercel** (Free)

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"
5. Site will be live at `https://your-project.vercel.app`

**Benefits:**
- Automatic deployments on push
- Free SSL certificate
- Built-in CDN
- Analytics

### 3. **Netlify** (Free)

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account
4. Select repository
5. Deploy settings are auto-configured
6. Click "Deploy"

**Benefits:**
- Free SSL
- Automatic builds
- Excellent performance
- Analytics dashboard

### 4. **Cloudflare Pages** (Free)

**Steps:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub account
3. Select the repository
4. Set Build command: `echo 'Static site'`
5. Set Publish directory: `.`
6. Deploy

**Benefits:**
- Global CDN
- Free SSL
- Analytics
- Workers integration

### 5. **Self-Hosted (VPS/Server)**

**Using Python:**
```bash
# Simple server
python3 -m http.server 8000

# With subdirectory
cd /var/www/pokemon-wheel
python3 -m http.server 80
```

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

**Using Docker:**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY . .
CMD ["python3", "-m", "http.server", "8000"]
```

```bash
docker build -t pokemon-wheel .
docker run -p 8000:8000 pokemon-wheel
```

## Custom Domain

### Using GitHub Pages with Custom Domain:
1. Create `CNAME` file in repository root:
   ```
   yourdomain.com
   ```
2. Update domain DNS settings to point to GitHub Pages
3. Enable "Enforce HTTPS" in Settings

### Using Vercel with Custom Domain:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Using Netlify with Custom Domain:
1. Go to Site Settings → Domain Management
2. Add new domain
3. Update DNS records as instructed

## Environment Considerations

### Browser Caching
- Static assets use aggressive caching by default
- For development, disable browser cache in DevTools
- For production, cache is appropriate

### CORS
- App uses PokéAPI (https://pokeapi.co/)
- No CORS issues as API supports it
- All cross-origin requests work automatically

### SSL/TLS
- All platforms provide free HTTPS
- Always use HTTPS in production
- GitHub Pages, Vercel, Netlify all handle this automatically

## Performance Optimization

### Current Setup
- No build step needed (static site)
- Assets load quickly
- PokéAPI is globally distributed

### Further Optimization Options
1. **Minify CSS/JS** (optional)
2. **Image optimization** (for wheel graphics)
3. **Service Worker** for offline support
4. **CDN caching** (included in most platforms)

## Monitoring & Analytics

### GitHub Pages
- Basic traffic stats in Settings

### Vercel
- Built-in Analytics dashboard
- Performance monitoring
- Error tracking

### Netlify
- Full analytics dashboard
- Performance stats
- Deployment history

### Cloudflare Pages
- Web Analytics
- Real User Monitoring (RUM)

## Troubleshooting Deployments

**CSS/JS not loading?**
- Check browser cache (Ctrl+Shift+Del)
- Verify file paths are correct
- Check deployment build logs

**API errors?**
- Check internet connection
- Verify PokéAPI is accessible
- Check browser console for CORS errors

**Wheel not working?**
- Ensure JavaScript is enabled
- Check Canvas support
- Verify all files deployed correctly

**Images not showing?**
- PokéAPI might be rate-limited
- Wait a moment and refresh
- Check network tab in DevTools

## Continuous Integration

### Automated Deployment
The `.github/workflows/deploy.yml` file automatically:
1. Triggers on push to `main` branch
2. Deploys to GitHub Pages
3. No manual steps required

### Manual Workflow
If you prefer manual deployments:
```bash
# Test locally
python3 -m http.server 8000

# Push to GitHub
git add .
git commit -m "Updates"
git push origin main

# Deploy (depending on your platform)
```

## Getting a Custom Domain

### Recommended Registrars
- Namecheap (~$8/year for .com)
- Google Domains ($12/year)
- Cloudflare ($8/year, plus free Cloudflare Pages)

### DNS Setup Examples

**For GitHub Pages:**
```
A record: 185.199.108.153
A record: 185.199.109.153
A record: 185.199.110.153
A record: 185.199.111.153
CNAME record (www): yourusername.github.io
```

**For Vercel/Netlify:**
- Follow platform-specific instructions
- Usually points to their CDN

## Going Live Checklist

- [ ] Code tested locally
- [ ] README updated
- [ ] .gitignore configured
- [ ] Sensitive data removed
- [ ] Platform account created
- [ ] Repository connected
- [ ] Initial deployment successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Site responsive on mobile
- [ ] All features tested in production

---

**Need Help?**
- Check the main README.md
- Review platform-specific documentation
- Check GitHub Issues for troubleshooting
