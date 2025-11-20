# 🚀 QUICK START - Deploy Your Website in 5 Minutes

Choose ONE option below and follow the steps:

## Option 1: GitHub Pages (Easiest - 2 minutes)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to website"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repo on GitHub.com
   - Click Settings → Pages
   - Select "main" branch
   - Click Save

3. **Done!** Your site is now live at:
   ```
   https://yourusername.github.io/random-generator
   ```

---

## Option 2: Vercel (Fastest - 3 minutes)

1. **Go to:** https://vercel.com/new

2. **Click:** "Import Git Repository"

3. **Select** your repository

4. **Click:** "Deploy"

5. **Done!** Your site is live at:
   ```
   https://your-project.vercel.app
   ```

---

## Option 3: Netlify (Simple - 3 minutes)

1. **Go to:** https://netlify.com

2. **Click:** "New site from Git"

3. **Connect GitHub** and select your repo

4. **Deploy settings auto-configured** - just click Deploy

5. **Done!** Your site is live

---

## Option 4: Cloudflare Pages (Fast CDN - 3 minutes)

1. **Go to:** https://pages.cloudflare.com

2. **Connect GitHub account**

3. **Select your repo**

4. **Settings:**
   - Build command: `echo 'Static site'`
   - Build output: `.`

5. **Click Deploy**

---

## Option 5: Local Server (For Testing)

```bash
# Start server
python3 -m http.server 8000

# Open browser to:
# http://localhost:8000
```

---

## Need a Custom Domain?

1. **Buy domain:** namecheap.com or google.com/domains (~$8/year)

2. **Add to your platform:**
   - **GitHub Pages:** Settings → Pages → Custom domain
   - **Vercel:** Project Settings → Domains → Add
   - **Netlify:** Site Settings → Domain Management → Add
   - **Cloudflare:** Add domain to Cloudflare, then Pages settings

3. **Update DNS** as instructed by platform

4. **Done!** Your site is at yourdomain.com

---

## Your Site is Now Live! 🎉

Share your URL:
- With friends
- On social media
- In your portfolio
- Anywhere!

---

## Troubleshooting

**Blank page?**
- Clear browser cache (Ctrl+Shift+Delete)
- Wait 2-3 minutes for deployment

**CSS/JS not loading?**
- Hard refresh (Ctrl+F5)
- Check file paths in index.html

**Wheel not working?**
- Open DevTools (F12)
- Check Console tab for errors
- Ensure JavaScript is enabled

---

**See DEPLOYMENT.md for detailed instructions on all platforms!**
