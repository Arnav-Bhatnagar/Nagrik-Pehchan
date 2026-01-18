# Deployment Guide - National Stress Index Monitoring System

## Build Status
✅ **Build Successful** - The project has been built and is ready for deployment.

### Build Output
- Output directory: `dist/`
- Index: `dist/index.html` (0.96 kB)
- CSS: `dist/assets/index-Cmdpiqgx.css` (24.62 kB)
- JavaScript: `dist/assets/index-DCmBbdeG.js` (482.53 kB)

---

## Deployment Options

### Option 1: Vercel (Recommended) ⭐
**Best for:** Production deployments with zero-config hosting

1. **Prerequisites:**
   - GitHub account with your code pushed
   - Vercel account (vercel.com)

2. **Steps:**
   ```bash
   # Option A: Connect via GitHub UI
   # 1. Go to https://vercel.com/new
   # 2. Import your GitHub repository
   # 3. Configure environment variables (see below)
   # 4. Deploy
   
   # Option B: Using Vercel CLI
   npm i -g vercel
   vercel --prod
   ```

3. **Environment Variables:**
   Add these in Vercel Project Settings → Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Configuration:** Already created `vercel.json` with build settings

---

### Option 2: Netlify
**Best for:** Continuous deployment from Git

1. **Connect via Netlify UI:**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables:**
   - Go to Site settings → Build & deploy → Environment
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Deploy:** Every push to main branch auto-deploys

---

### Option 3: GitHub Pages
**Best for:** Free static hosting

1. **Add deployment script to `package.json`:**
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub:**
   - Repository Settings → Pages → Source: `gh-pages` branch

---

### Option 4: Docker + Cloud Deployment
**Best for:** Custom infrastructure (AWS, Google Cloud, Azure, etc.)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

Deploy:
```bash
docker build -t stress-index .
docker run -p 80:80 stress-index
```

---

### Option 5: Manual Deployment (Any Static Host)
**Best for:** FTP, cPanel, or direct server upload

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder contents to your host:**
   - Via FTP client (FileZilla, etc.)
   - Via cPanel File Manager
   - Via SSH: `scp -r dist/* user@host:/path/to/public_html`

3. **Configure for single-page app:**
   - Ensure `.htaccess` exists (if Apache):
     ```
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```

---

## Environment Variables Required

For Supabase integration to work, you need:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from Supabase:
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API → Find `Project URL` and `anon` (public) key

---

## Pre-Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Lint passes: `npm run lint`
- [ ] Supabase environment variables configured
- [ ] Database migrations applied (if needed)
- [ ] `.env` or configuration secrets are NOT committed to git
- [ ] `dist/` directory is NOT committed (it's in .gitignore)

---

## Post-Deployment Verification

1. **Test the live site:**
   - Can you access the home page?
   - Can you select states?
   - Can you toggle between English/Hindi?
   - Do charts load with data?
   - Check browser console for errors

2. **Performance:**
   - Check Core Web Vitals: https://pagespeed.web.dev/
   - Monitor Supabase dashboard for database queries

3. **Monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor database performance
   - Set up uptime monitoring

---

## Quick Deploy Commands

**Vercel (fastest):**
```bash
npm i -g vercel
vercel --prod
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**Build only (for manual upload):**
```bash
npm run build
# Then upload dist/ folder to your host
```

---

## Troubleshooting

### "CORS error" or "Can't connect to Supabase"
- Check environment variables are set correctly
- Verify Supabase URL and keys are valid
- Check Supabase project is running

### "Blank page" or "404"
- Ensure web server is configured to serve `index.html` for all routes
- Check browser console for errors
- Verify all assets are loaded (CSS, JS)

### "Charts not showing"
- Check Supabase database connection
- Verify data exists in `aadhaar_enrollment` table
- Check API response in Network tab

---

## Support

For issues:
1. Check [Vite docs](https://vitejs.dev/)
2. Check [Supabase docs](https://supabase.com/docs)
3. Check deployment platform documentation
