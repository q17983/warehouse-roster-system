# Railway Setup Without Volumes (Temporary Solution)

Since you can't find the Volumes section in Railway, we'll use a workaround that will work for now.

## Important Note About Data Persistence

**Without a volume:**
- ✅ Your app will work normally
- ✅ Data will persist as long as the service is running
- ⚠️ Data will be **lost** if Railway fully restarts/redeploys your service
- ⚠️ For production use, you'll eventually want persistent storage

**For now, this is fine for:**
- Testing
- Small deployments
- If Railway doesn't restart your service often

---

## Setup Steps

### Step 1: Set Environment Variables

Go to Railway → Your Service → **"Variables"** tab:

**Variable 1:**
```
Name: APPS_SCRIPT_WEB_APP_URL
Value: https://script.google.com/macros/s/AKfycbzM1gtRnaTMrQJKDKK72sJTia0vbYI-7ocQvYAY4TGVailHzzrIrYvyKP2iGSG-82m8zA/exec
```

**Variable 2:**
```
Name: DATABASE_PATH
Value: ./roster.db
```

**Variable 3:**
```
Name: NODE_ENV
Value: production
```

⚠️ **Notice:** Using `./roster.db` instead of `/data/roster.db` since we don't have a volume.

---

### Step 2: Railway Will Redeploy

After adding the variables, Railway will automatically redeploy.

---

### Step 3: Test Your App

1. **Home:** `https://warehouse-roster-system-production.up.railway.app`
2. **Admin:** `https://warehouse-roster-system-production.up.railway.app/admin`
3. **Leader:** `https://warehouse-roster-system-production.up.railway.app/leader`
4. **Sync:** `https://warehouse-roster-system-production.up.railway.app/api/sync`

---

### Step 4: Process Your Data

1. Go to Admin panel
2. Click "Process Data"
3. Your data will sync from Google Sheets

---

## Future: Getting Persistent Storage

If you need persistent storage later:

1. **Check Your Railway Plan:**
   - Some features require Pro plan
   - Check Railway pricing page

2. **Try Railway CLI:**
   ```bash
   railway volumes create data --mount /data
   ```

3. **Contact Railway Support:**
   - Ask them where to find Volumes in your plan

4. **Alternative:** Consider migrating to Railway's PostgreSQL database later (requires code changes)

---

## For Now: This Works!

Your app will function normally. Just be aware that if Railway does a full restart, you'll need to re-process your data from Google Sheets (which is automatic if you set up auto-sync).

