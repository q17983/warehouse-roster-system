# 🔧 Fixing Railway Database Issues

## Problems Identified

1. **Data lost on redeploy** → Database is in ephemeral storage (gets wiped)
2. **"Check Staff" shows empty** → Assignments aren't persisting (same root cause)

## Root Cause

**Railway uses ephemeral filesystem** - files are deleted on every redeploy unless stored in a **persistent volume**.

Your database is currently being written to ephemeral storage, so:
- Data gets wiped on redeploy ❌
- Assignments may disappear immediately ❌

## ✅ What I've Done

1. **Added comprehensive logging** to track database operations
2. **Created debug endpoint** (`/api/debug/db`) to check database state
3. **Enhanced error messages** to identify database path/permission issues

## 🎯 What You Need to Do

### Step 1: Create Persistent Volume (CRITICAL!)

You MUST create a volume for data to persist. Without it, data will always be lost on redeploy.

**Option A: Railway Dashboard**
1. Railway Dashboard → Your Service → **Settings** tab
2. Scroll ALL the way down
3. Look for **"Volumes"** or **"Storage"** section
4. Click **"New Volume"**
5. Name: `data`
6. Mount Path: `/data`
7. Click **Create**

**Option B: Railway CLI with API Token** (If dashboard doesn't show volumes)

1. **Get API Token:**
   - Railway Dashboard → Profile (top right) → Settings → Tokens
   - Create new token → Copy it

2. **Create Volume:**
   ```bash
   cd "/Users/sai/Warehouse management"
   
   # Login with token
   export RAILWAY_TOKEN="your_token_here"
   npx @railway/cli login --browserless $RAILWAY_TOKEN
   
   # Create volume
   npx @railway/cli volume add --mount-path /data
   
   # Set DATABASE_PATH (if not already set)
   npx @railway/cli variables set DATABASE_PATH="/data/roster.db"
   ```

### Step 2: Verify Environment Variable

Railway Dashboard → Your Service → **Variables** tab

**Must have:**
- ✅ `DATABASE_PATH=/data/roster.db`

If missing, add it:
1. Click **"New Variable"**
2. Name: `DATABASE_PATH`
3. Value: `/data/roster.db`

### Step 3: Test After Changes

After creating volume and setting variable:

1. **Wait for redeploy** (2-3 minutes)
2. **Check Railway logs:**
   - Railway Dashboard → Deployments → Latest → View Logs
   - Look for: `[Database] DATABASE_PATH env: /data/roster.db`
   - Look for: `[Database] Directory exists: true`

3. **Process data** in Admin Panel
4. **Assign staff** to a date
5. **Check Staff** → Should show assigned date
6. **Visit debug endpoint:** `https://warehouse-roster-system-production.up.railway.app/api/debug/db`
   - Check `rosterCount` → Should be > 0 after assigning

7. **Wait 5 minutes, check again** → Data should still be there
8. **Trigger a redeploy** → Data should survive!

## 🔍 Debugging Tools

### Check Database State

Visit: `https://warehouse-roster-system-production.up.railway.app/api/debug/db`

This shows:
- Database path
- Record counts (staff, availability, roster)
- Sample roster entries
- Environment variables

**Use this to verify:**
- ✅ Assignments are being saved (`rosterCount > 0`)
- ✅ `DATABASE_PATH` is set correctly

### Check Railway Logs

Railway Dashboard → Deployments → Latest → View Logs

**Look for:**
- `[Database] Initializing database at: /data/roster.db` ✅
- `[Database] Directory exists: true` ✅
- `[Database] Database opened successfully` ✅
- `[Roster API] Added assignment: ...` ✅ (when you save)
- `[RosterModel] Total roster entries in DB: X` ✅

**Red flags:**
- `DATABASE_PATH env: not set (using default)` ❌
- `Database directory: /app/roster.db` ❌ (wrong path)
- `Directory exists: false` ❌ (volume not mounted)
- Permission errors ❌

## 📋 Checklist

Before testing, verify:

- [ ] Volume created and mounted at `/data`
- [ ] `DATABASE_PATH=/data/roster.db` is set in Variables
- [ ] Railway logs show correct database path
- [ ] `/api/debug/db` shows database state

After testing:

- [ ] Assign staff → `rosterCount` increases in `/api/debug/db`
- [ ] "Check Staff" shows assigned dates
- [ ] Data persists after 5+ minutes
- [ ] Data persists after redeploy

## 🚨 If Still Not Working

1. **Check Railway logs** for database errors
2. **Visit `/api/debug/db`** - what does it show?
3. **Verify volume** - is it actually mounted at `/data`?
4. **Check permissions** - Railway logs should show if directory is writable

## 📖 More Details

See `RAILWAY_DEBUG_GUIDE.md` for comprehensive debugging steps.

