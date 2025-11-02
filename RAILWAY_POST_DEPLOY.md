# 🎉 Railway Deployment - Post-Deploy Setup

Your app is deployed! Now complete these final steps:

---

## Step 1: Get Your Railway URL

1. In Railway dashboard → Your project
2. Click on your **service** (the app)
3. Go to **"Settings"** tab
4. Scroll to **"Domains"** section
5. You'll see a URL like: `https://your-app-name.up.railway.app`
6. **Copy this URL** - you'll need it!

---

## Step 2: Set Environment Variables

1. In Railway → Your service → **"Variables"** tab
2. Click **"New Variable"** for each:

   **Variable 1:**
   ```
   Name: APPS_SCRIPT_WEB_APP_URL
   Value: https://script.google.com/macros/s/AKfycbzM1gtRnaTMrQJKDKK72sJTia0vbYI-7ocQvYAY4TGVailHzzrIrYvyKP2iGSG-82m8zA/exec
   ```

   **Variable 2:**
   ```
   Name: DATABASE_PATH
   Value: /data/roster.db
   ```

   **Variable 3:**
   ```
   Name: NODE_ENV
   Value: production
   ```

3. Railway will automatically redeploy when you add variables

---

## Step 3: Create Persistent Volume (IMPORTANT!)

**Why:** Your database needs to persist between restarts

1. In Railway → Your service → **"Settings"** tab
2. Scroll to **"Volumes"** section
3. Click **"New Volume"**
4. Configure:
   - **Name:** `data` (or any name you like)
   - **Mount Path:** `/data` ⚠️ **MUST be exactly `/data`**
5. Click **"Create"**
6. Railway will restart your service

---

## Step 4: Test Your Deployment

1. **Visit your app:**
   ```
   https://your-app-name.up.railway.app
   ```
   Should show the home page

2. **Test sync endpoint:**
   ```
   https://your-app-name.up.railway.app/api/sync
   ```
   Should return JSON: `{"success":true,...}`

3. **Test admin panel:**
   ```
   https://your-app-name.up.railway.app/admin
   ```
   Should show the admin interface

4. **Test leader app:**
   ```
   https://your-app-name.up.railway.app/leader
   ```
   Should show the calendar for roster planning

---

## Step 5: Process Your First Data

1. Go to: `https://your-app-name.up.railway.app/admin`
2. Click **"Process Data"** button
3. Wait for success message
4. Your data from Google Sheets will be synced!

---

## Step 6: Set Up Auto-Sync (Optional but Recommended)

This makes your data sync automatically every hour.

1. **Get your sync URL:**
   ```
   https://your-app-name.up.railway.app/api/sync
   ```

2. **Open Google Apps Script:**
   - Go to your Google Sheet → Extensions → Apps Script

3. **Add the auto-sync function:**
   - Copy code from `google-apps-script-auto-sync.js` in this project
   - Or add this function to your existing `google-apps-script.js`:
   
   ```javascript
   function autoSyncToWebApp() {
     // ⚠️ REPLACE WITH YOUR RAILWAY URL
     const WEB_APP_SYNC_URL = 'https://your-app-name.up.railway.app/api/sync';
     
     try {
       Logger.log('Starting automatic sync...');
       
       const response = UrlFetchApp.fetch(WEB_APP_SYNC_URL, {
         method: 'GET',
         muteHttpExceptions: true,
         headers: {
           'Content-Type': 'application/json'
         }
       });
       
       const statusCode = response.getResponseCode();
       const responseText = response.getContentText();
       
       if (statusCode === 200) {
         const result = JSON.parse(responseText);
         if (result.success) {
           Logger.log('✅ Auto-sync successful!');
           Logger.log('Staff: ' + result.stats.staffCount);
           Logger.log('Availability: ' + result.stats.availabilityCount);
         } else {
           Logger.log('❌ Auto-sync failed: ' + result.message);
         }
       } else {
         Logger.log('❌ HTTP Error ' + statusCode + ': ' + responseText);
       }
     } catch (error) {
       Logger.log('❌ Auto-sync error: ' + error.toString());
     }
   }
   ```

4. **Set up hourly trigger:**
   - In Apps Script → **"Triggers"** (clock icon)
   - Click **"Add Trigger"**
   - Configure:
     - **Function:** `autoSyncToWebApp`
     - **Event source:** Time-driven
     - **Type:** Hour timer
     - **Interval:** Every hour
   - Click **"Save"**

5. **Test it:**
   - In Apps Script → Run → `autoSyncToWebApp`
   - Check execution log to see if it works

---

## ✅ You're Done!

Your warehouse roster system is now:
- ✅ Deployed and accessible from anywhere
- ✅ Connected to your Google Sheets data
- ✅ Ready for your leader to use on their iPhone
- ✅ Auto-syncing every hour (if Step 6 completed)

---

## Share with Your Leader

Give them this URL:
```
https://your-app-name.up.railway.app/leader
```

They can bookmark it on their iPhone and start planning rosters immediately!

---

## Troubleshooting

**App not loading?**
- Wait 1-2 minutes after adding environment variables
- Check Railway logs: Service → "Logs" tab
- Make sure deployment is "Active" (green)

**Database not working?**
- Verify volume is mounted at `/data`
- Check `DATABASE_PATH=/data/roster.db` is set correctly
- Check Railway logs for database errors

**Sync not working?**
- Test the sync endpoint manually first
- Check Apps Script execution logs
- Verify your Railway URL is correct in Apps Script
- Make sure `APPS_SCRIPT_WEB_APP_URL` is set in Railway

---

## Quick Reference URLs

Once configured, your URLs will be:
- **Home:** `https://your-app-name.up.railway.app`
- **Admin:** `https://your-app-name.up.railway.app/admin`
- **Leader App:** `https://your-app-name.up.railway.app/leader`
- **Sync Endpoint:** `https://your-app-name.up.railway.app/api/sync`

🎉 **Happy roster planning!**

