# 🚀 Railway Quick Deploy (3 Steps)

## Prerequisites
- ✅ Railway account (free tier is fine!)
- ✅ Your project code ready to deploy
- ✅ Your Apps Script Web App URL ready

---

## Step 1: Push to GitHub (if not already done)

If you haven't committed your code to GitHub yet:

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - Warehouse roster system"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**OR** if you prefer to deploy directly without Git:
- Railway also supports deploying from a local folder (see Step 2)

---

## Step 2: Deploy to Railway

### Via Dashboard (Recommended):

1. **Go to Railway:**
   - Visit: https://railway.app
   - Click **"Login"** → Sign in with GitHub

2. **Create New Project:**
   - Click **"New Project"** button
   - Choose **"Deploy from GitHub repo"**
   - Select your repository
   - Railway will start deploying automatically!

3. **Wait for Build** (2-3 minutes)
   - Railway is building your app
   - You'll see build logs in real-time
   - ✅ Build succeeds when you see: `npm start`

4. **Get Your App URL:**
   - Railway will generate a URL like: `https://your-app-name.up.railway.app`
   - **Copy this URL** - you'll need it!

---

## Step 3: Configure Environment Variables & Volume

### A. Set Environment Variables:

1. In Railway dashboard → Your project
2. Click on your **service** (the app you just deployed)
3. Go to **"Variables"** tab
4. Click **"New Variable"** and add each:

   ```
   Variable Name: APPS_SCRIPT_WEB_APP_URL
   Value: https://script.google.com/macros/s/AKfycbzM1gtRnaTMrQJKDKK72sJTia0vbYI-7ocQvYAY4TGVailHzzrIrYvyKP2iGSG-82m8zA/exec
   ```

   ```
   Variable Name: DATABASE_PATH
   Value: /data/roster.db
   ```

   ```
   Variable Name: NODE_ENV
   Value: production
   ```

5. Railway will automatically redeploy when you add variables

### B. Create Persistent Volume (IMPORTANT!):

**Why:** Your database needs to survive restarts

1. In your service → **"Settings"** tab
2. Scroll to **"Volumes"** section
3. Click **"New Volume"**
4. Configure:
   - **Name:** `data` (or any name)
   - **Mount Path:** `/data` (MUST be exactly `/data`)
5. Click **"Create"**
6. Railway will restart your app with the volume mounted

---

## Step 4: Test Your Deployment

1. **Visit your Railway URL:**
   ```
   https://your-app-name.up.railway.app
   ```

2. **Test the sync endpoint:**
   ```
   https://your-app-name.up.railway.app/api/sync
   ```
   Should return JSON: `{"success": true, ...}`

3. **Test admin panel:**
   ```
   https://your-app-name.up.railway.app/admin
   ```

4. **Test leader app:**
   ```
   https://your-app-name.up.railway.app/leader
   ```

---

## Step 5: Update Apps Script for Auto-Sync

1. **Copy your Railway URL:**
   - Example: `https://your-app-name.up.railway.app`

2. **Open your Google Apps Script:**
   - Go to your Google Sheet → Extensions → Apps Script

3. **Update the `autoSyncToWebApp` function:**
   ```javascript
   function autoSyncToWebApp() {
     const WEB_APP_SYNC_URL = 'https://your-app-name.up.railway.app/api/sync';
     // ... rest of the function
   }
   ```

4. **Set up hourly trigger:**
   - Apps Script → Triggers → Add Trigger
   - Function: `autoSyncToWebApp`
   - Event source: Time-driven
   - Type: Hour timer
   - Interval: Every hour

---

## ✅ Done!

Your app is now live! 🎉

**Your URLs:**
- **Main App:** `https://your-app-name.up.railway.app`
- **Admin:** `https://your-app-name.up.railway.app/admin`
- **Leader App:** `https://your-app-name.up.railway.app/leader`

**Share the Leader App URL with your warehouse leader** - they can use it on their iPhone! 📱

---

## Troubleshooting

**Build fails?**
- Check Railway build logs
- Make sure `package.json` has all dependencies
- Verify Node.js version (should auto-detect)

**Database not working?**
- Make sure you created the volume at `/data`
- Check `DATABASE_PATH=/data/roster.db` is set
- Check Railway logs for database errors

**Can't access the app?**
- Wait a few seconds after deployment
- Check Railway dashboard → your service → "Deployments" → should show "Active"
- Click on your service → "Settings" → check "Public" is enabled

**Need help?**
- Check Railway logs: Service → "Logs" tab
- Check full guide: `DEPLOY_TO_RAILWAY.md`

