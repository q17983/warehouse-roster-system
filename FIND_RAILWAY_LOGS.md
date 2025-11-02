# How to Find Railway Logs

## Method 1: Through Service View (Most Common)

1. **Go to Railway Dashboard:** https://railway.app
2. **Click on your project** (`warehouse-roster-system`)
3. **Click on your service** (the deployed app, usually named `warehouse-roster-system` or `web`)
4. Look for **"Logs"** tab in the top menu bar
   - It's usually next to "Metrics", "Settings", "Variables"
   - OR look for a **"Deployments"** tab → Click on latest deployment → Should see logs

## Method 2: Through Deployments

1. Railway Dashboard → Your Project → Your Service
2. Look for **"Deployments"** section or tab
3. Click on the **latest deployment** (top of the list)
4. You should see build logs and runtime logs

## Method 3: Alternative Locations

Railway's UI can vary. Look for:
- **"Logs"** (top menu)
- **"Deployments"** → Latest deployment → Logs
- **"Observability"** → Logs
- **"Metrics"** tab → Scroll down for logs
- Bottom of service page might have a log viewer

---

## If You Still Can't Find Logs

### Alternative: Check via API or Direct Test

Instead of checking logs, let's test if the volume is working by:

1. **Test if data persists** (easiest way):
   - Process data → Assign staff → Check staff
   - Wait a few minutes
   - Visit the site again
   - If data is still there → Volume might be working
   - If data is gone → Volume is NOT set up

2. **Check environment variables:**
   - Railway Dashboard → Your Service → **Variables** tab
   - Look for `DATABASE_PATH`
   - If it says `/data/roster.db` → Good sign!
   - If it says `./roster.db` or missing → Need to set it up

---

## Visual Guide (What to Look For)

In Railway Dashboard:

```
Project: warehouse-roster-system
  └── Service: warehouse-roster-system
      ├── [Deployments] ← Click here
      ├── [Logs] ← OR here
      ├── [Variables] ← Check here for DATABASE_PATH
      ├── [Metrics]
      └── [Settings]
```

---

## Quick Check: Variables Tab

**Easier method** - Check Variables instead of logs:

1. Railway Dashboard → Your Service → **Variables** tab
2. Look for: `DATABASE_PATH`
3. **If you see:**
   - ✅ `DATABASE_PATH=/data/roster.db` → Volume should be set up!
   - ❌ `DATABASE_PATH=./roster.db` → Need to set up volume
   - ❌ Not there at all → Need to create volume AND set variable

---

## Still Can't Find It?

**Share with me:**
- What tabs/sections you see in Railway when you click on your service
- Or take a screenshot and describe what you see
- I'll help you locate the logs

---

## Alternative: Test Without Logs

We can verify volume is working by testing data persistence:

1. Process data
2. Assign staff  
3. Close browser, wait 5 minutes
4. Come back - if data is still there → Volume working!
5. If data is gone → Volume not set up

