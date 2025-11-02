# Railway Database Persistence Issue

## Problem
- Data is lost after redeploy
- Need to re-process data every time
- "Check Staff" not showing assigned staff

## Root Cause
Without a persistent volume, Railway uses **ephemeral storage**. This means:
- Database file (`roster.db`) is created in the container filesystem
- When Railway redeploys, the container is recreated
- All files in ephemeral storage are lost
- Database is wiped clean

## Solutions

### Solution 1: Set Up Persistent Volume (Best - Permanent Fix)

**Why you couldn't find it:**
- Railway's UI may have changed
- Volumes might require a paid plan
- Or it's in a different location

**Try These Steps:**

1. **Railway Dashboard → Your Service → Settings**
2. Look for sections:
   - "Volumes"
   - "Storage" 
   - "Persistent Storage"
   - "Mount Points"
3. Or try creating volume via CLI:
   ```bash
   railway volumes create data --mount /data
   ```

**Then update environment variable:**
```
DATABASE_PATH=/data/roster.db
```

### Solution 2: Use Railway's PostgreSQL (Alternative)

Railway offers managed PostgreSQL databases:
1. In Railway → New → Database → PostgreSQL
2. Get connection string
3. Update code to use PostgreSQL instead of SQLite
4. Requires code changes (significant)

### Solution 3: Accept Temporary Storage (Workaround)

For now, using `./roster.db` means:
- ✅ Works during runtime
- ✅ Data persists while service is running
- ❌ Lost on redeploy
- ❌ Lost on service restart

**This is acceptable for:**
- Testing
- Development
- Small deployments with infrequent redeploys

### Solution 4: Auto-Sync on Startup (Temporary Fix)

Add automatic data sync when app starts:
- App checks if database is empty
- If empty, automatically calls `/api/sync`
- This way data is restored after redeploy

---

## Current Status Check

To verify if database is working:

1. **Check if database file exists:**
   - Railway Dashboard → Your Service → Logs
   - Look for database initialization messages

2. **Test direct API:**
   ```
   https://warehouse-roster-system-production.up.railway.app/api/staff
   ```
   Should return staff list if database has data

3. **Check environment variable:**
   - Railway Dashboard → Your Service → Variables
   - Verify `DATABASE_PATH` is set

---

## Recommended Next Steps

1. **Try to find/create volume again:**
   - Check Railway documentation
   - Contact Railway support
   - Or try Railway CLI

2. **If no volume available:**
   - Use current setup (ephemeral storage)
   - Accept that data needs re-processing after redeploy
   - Set up automatic sync (see Solution 4 above)

3. **For production:**
   - Definitely need persistent storage
   - Either Railway volume OR PostgreSQL

---

## Why It Works Locally But Not on Railway

**Locally:**
- Database file (`roster.db`) is in your project folder
- File persists between runs
- Data is saved permanently

**On Railway (without volume):**
- Database file is in container filesystem
- Container is destroyed on redeploy
- Files are lost with container

---

## Quick Check: Is Database Being Written?

Test this:
1. Process data → Assign staff
2. Check `/api/staff` endpoint → Should see staff
3. Check `/api/roster/2025-11-05` → Should see assignments
4. Redeploy → Data is gone (expected without volume)

