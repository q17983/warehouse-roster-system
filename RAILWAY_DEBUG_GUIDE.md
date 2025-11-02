# 🔍 Railway Debugging Guide

This guide helps you diagnose why data is disappearing on Railway.

## Issue 1: Data Lost on Redeploy

**Symptom:** Every time you redeploy, all data (staff, availability, rosters) disappears.

**Root Cause:** Database file is stored in ephemeral filesystem that gets wiped on redeploy.

**Solution:** You MUST create a persistent volume. Without it, data cannot persist.

---

## Issue 2: "Check Staff" Shows Empty After Assigning

**Symptom:** You assign staff to dates, but "Check Staff" shows no scheduled dates.

**Possible Causes:**
1. Database is being written to ephemeral storage (lost immediately)
2. Database path is incorrect
3. Database connection is using wrong instance

---

## 🔧 Debug Steps

### Step 1: Check Database State

After assigning staff, visit this URL:
```
https://warehouse-roster-system-production.up.railway.app/api/debug/db
```

**What to look for:**
- ✅ `rosterCount > 0` → Assignments ARE being saved
- ❌ `rosterCount = 0` → Assignments are NOT being saved
- Check `DATABASE_PATH` → Should be `/data/roster.db` if volume is set up

### Step 2: Check Railway Logs

1. Railway Dashboard → Your Service → **Deployments** tab
2. Click on latest deployment → **View Logs**
3. Look for these log messages:
   - `[Database] Initializing database at: ...`
   - `[Database] DATABASE_PATH env: ...`
   - `[Database] Database file exists: ...`

**What to check:**
- Is `DATABASE_PATH` set correctly?
- Does the directory exist?
- Are there permission errors?

### Step 3: Check Environment Variables

Railway Dashboard → Your Service → **Variables** tab

**Must have:**
- ✅ `DATABASE_PATH=/data/roster.db`

**If missing:**
1. Click **"New Variable"**
2. Name: `DATABASE_PATH`
3. Value: `/data/roster.db`
4. Click **Add**

### Step 4: Verify Volume Exists

Railway Dashboard → Your Service → **Settings** tab
Scroll ALL the way down - look for **"Volumes"** section

**If you see it:**
- ✅ Volume should be mounted at `/data`
- If not, create one

**If you DON'T see it:**
- Volume feature might not be available in your plan
- Or it's hidden - try Railway CLI (see below)

---

## 🚨 Critical: Setting Up Persistent Volume

Without a volume, your database is **ephemeral** (temporary). Every redeploy wipes it.

### Option A: Railway Dashboard (Easiest)

1. Railway Dashboard → Your Project → Your Service
2. **Settings** tab → Scroll to bottom
3. Look for **"Volumes"** or **"Storage"** section
4. Click **"New Volume"** or **"Add Volume"**
5. Name: `data`
6. Mount Path: `/data`
7. Click **Create**

### Option B: Railway CLI (If Dashboard Not Available)

**Prerequisites:** You need a Railway API token (can't use browser login in terminal)

#### Get API Token:
1. Railway Dashboard → Click your profile (top right)
2. **Settings** → **Tokens** (or **API** section)
3. Click **"New Token"**
4. Copy the token

#### Create Volume via CLI:
```bash
cd "/Users/sai/Warehouse management"

# Login with token
export RAILWAY_TOKEN="your_token_here"
npx @railway/cli login --browserless $RAILWAY_TOKEN

# Link to project (if needed)
npx @railway/cli link

# Create volume
npx @railway/cli volume add --mount-path /data

# Set DATABASE_PATH variable
npx @railway/cli variables set DATABASE_PATH="/data/roster.db"
```

### Option C: Contact Railway Support

If volumes aren't accessible:
- Email Railway support: support@railway.app
- Ask: "How do I create a persistent volume for my Railway service?"
- Mention: You're using SQLite and need persistent storage

---

## 🧪 Test After Volume Setup

1. **Process Data** in Admin Panel
2. **Assign Staff** to a date (e.g., next Monday)
3. **Check Staff** → Should show the assigned date
4. **Wait 5 minutes**
5. **Check Staff again** → Should still show (data persisted!)
6. **Redeploy** (Railway Dashboard → Deployments → Redeploy)
7. **Check Staff** → Should STILL show (data survived redeploy!)

---

## 📊 What the Logs Tell You

### Good Signs ✅:
```
[Database] Initializing database at: /data/roster.db
[Database] DATABASE_PATH env: /data/roster.db
[Database] Directory exists: true
[Database] Database opened successfully
[Roster API] Added assignment: staffId=1, date=2024-11-11
[RosterModel] Total roster entries in DB: 1
```

### Bad Signs ❌:
```
[Database] Initializing database at: /app/roster.db  ← Wrong path!
[Database] DATABASE_PATH env: not set (using default)  ← Missing variable!
[Database] Directory exists: false  ← Volume not mounted!
[Database] Failed to create directory: EACCES  ← Permission error!
[RosterModel] Total roster entries in DB: 0  ← Nothing saved!
```

---

## 🎯 Quick Checklist

- [ ] `DATABASE_PATH=/data/roster.db` is set in Railway Variables
- [ ] Volume exists and is mounted at `/data`
- [ ] `/api/debug/db` shows `rosterCount > 0` after assigning staff
- [ ] Railway logs show `DATABASE_PATH env: /data/roster.db`
- [ ] Data persists after redeploy

---

## 💡 Why It Works Locally But Not on Railway

**Local environment:**
- Database file is in your project folder
- Files persist between runs
- No volume needed

**Railway environment:**
- Ephemeral filesystem gets wiped on redeploy
- Must use persistent volume for data to survive
- Database must be in `/data` (volume mount point)

---

## 🆘 Still Having Issues?

1. **Check Railway logs** for database errors
2. **Visit `/api/debug/db`** to see database state
3. **Verify volume** exists and is mounted
4. **Contact Railway support** if volume feature isn't accessible

