# Deploy to Railway - Step by Step Guide

## Quick Deploy (5 minutes)

### Step 1: Prepare Your Project

Your project is already set up! Just make sure:

1. ✅ All files are committed (if using git)
2. ✅ `.env.local` exists with your Apps Script URL
3. ✅ Database will be created automatically

### Step 2: Deploy to Railway

#### Option A: Deploy via Railway Dashboard (Easiest)

1. **Go to Railway:**
   - Visit https://railway.app
   - Sign in with your GitHub account (or create account)

2. **Create New Project:**
   - Click **"New Project"**
   - Choose **"Deploy from GitHub repo"** (recommended)
     - Connect your GitHub account if not already connected
     - Select the repository containing this project
     - OR choose **"Empty Project"** → **"Deploy from GitHub repo"** → Select your repo

3. **Configure Build:**
   - Railway will auto-detect Next.js
   - It will run: `npm install && npm run build`
   - Build settings are in `railway.json` (already created)

4. **Set Environment Variables:**
   - In your Railway project, go to **Variables** tab
   - Add these variables:
     ```
     APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycbzM1gtRnaTMrQJKDKK72sJTia0vbYI-7ocQvYAY4TGVailHzzrIrYvyKP2iGSG-82m8zA/exec
     DATABASE_PATH=/data/roster.db
     NODE_ENV=production
     ```
   - **Important:** Use `/data/roster.db` for Railway (persistent storage)

5. **Add Persistent Volume (for database):**
   - Go to your service → **Settings** → **Volumes**
   - Click **"New Volume"**
   - Mount path: `/data`
   - This keeps your database safe when service restarts

6. **Deploy:**
   - Railway will automatically deploy
   - Wait for build to complete (2-3 minutes)
   - You'll get a URL like: `https://your-app.up.railway.app`

#### Option B: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to existing project or create new
railway link

# Set environment variables
railway variables set APPS_SCRIPT_WEB_APP_URL="https://script.google.com/macros/s/AKfycbzM1gtRnaTMrQJKDKK72sJTia0vbYI-7ocQvYAY4TGVailHzzrIrYvyKP2iGSG-82m8zA/exec"
railway variables set DATABASE_PATH="/data/roster.db"
railway variables set NODE_ENV="production"

# Create volume for database
railway volumes create data --mount /data

# Deploy
railway up
```

### Step 3: Get Your Deployed URL

1. After deployment, Railway will give you a URL
2. It looks like: `https://warehouse-roster-production.up.railway.app`
3. **Copy this URL** - you'll need it for Apps Script!

### Step 4: Update Apps Script with Your Railway URL

1. **Copy your Railway URL**
   - Example: `https://warehouse-roster-production.up.railway.app`

2. **Update `google-apps-script-auto-sync.js`:**
   ```javascript
   const WEB_APP_SYNC_URL = 'https://warehouse-roster-production.up.railway.app/api/sync';
   ```

3. **Or add to your existing `google-apps-script.js`:**
   - Add the `autoSyncToWebApp()` function
   - Use your Railway URL

4. **Set up trigger** (hourly sync)

### Step 5: Test Your Deployed App

1. Visit your Railway URL
2. Test the sync endpoint:
   ```
   https://your-app.up.railway.app/api/sync
   ```
3. Should return JSON with success message

---

## Environment Variables for Railway

Add these in Railway Dashboard → Variables:

```
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycbzM1gtRnaTMrQJKDKK72sJTia0vbYI-7ocQvYAY4TGVailHzzrIrYvyKP2iGSG-82m8zA/exec
DATABASE_PATH=/data/roster.db
NODE_ENV=production
```

**Important:** 
- Use `/data/roster.db` (not `./roster.db`) 
- Mount a volume at `/data` for persistent storage
- Your database will survive deployments!

---

## Railway-Specific Setup

### Persistent Volume (Required!)

**Why:** Your database needs to persist between deployments

**How:**
1. In Railway dashboard → Your service
2. Go to **Settings** → **Volumes**
3. Click **"New Volume"**
4. Name: `data`
5. Mount path: `/data`
6. Click **Create**

This ensures your `roster.db` file is saved even when Railway restarts your app.

---

## First Time Setup Checklist

- [ ] Project deployed to Railway
- [ ] Environment variables set
- [ ] Volume created at `/data`
- [ ] App is running (check Railway dashboard)
- [ ] Test sync endpoint: `https://your-app.up.railway.app/api/sync`
- [ ] Update Apps Script with Railway URL
- [ ] Set up hourly trigger in Apps Script
- [ ] Test automatic sync

---

## After Deployment

### Get Your Sync URL:

```
https://YOUR_RAILWAY_APP_URL/api/sync
```

Use this in your Apps Script `autoSyncToWebApp()` function!

---

## Troubleshooting

**Build fails:**
- Check Railway build logs
- Make sure all dependencies are in `package.json`

**Database not persisting:**
- Verify volume is mounted at `/data`
- Check `DATABASE_PATH=/data/roster.db` is set

**Sync endpoint not working:**
- Check environment variables are set
- Verify Apps Script URL is correct
- Check Railway logs for errors

---

## Railway Dashboard URLs

- **Your App:** `https://your-app.up.railway.app`
- **Sync Endpoint:** `https://your-app.up.railway.app/api/sync`
- **Admin Panel:** `https://your-app.up.railway.app/admin`
- **Leader App:** `https://your-app.up.railway.app/leader`

Your warehouse leader can now access the app from anywhere! 📱

