# 🔍 Find Volume in Railway (Visual Guide)

Railway's UI has changed. Here's where to look:

## Method 1: Check in Settings Tab

1. **Railway Dashboard** → Click your project (`warehouse-roster-system`)
2. Click on your **service** (the one that's deployed)
3. Click **"Settings"** tab at the top
4. **Scroll ALL the way down** to the bottom of the page
5. Look for section called:
   - **"Volumes"** or
   - **"Storage"** or
   - **"Persistent Storage"**

### If you see it:
- There might already be a volume listed
- Or you'll see **"+ New Volume"** button

### If you DON'T see it:
- The feature might be hidden in your plan
- Or Railway changed the UI again
- Try Method 2

---

## Method 2: Check in Project Dashboard

1. **Railway Dashboard** → Click your **project name** (not the service)
2. Look at the left sidebar or top menu
3. Check for:
   - **"Resources"** tab
   - **"Infrastructure"** section
   - **"Volumes"** link

---

## Method 3: Check in Service Overview

1. **Railway Dashboard** → Your service
2. Look at the main dashboard (overview page)
3. You might see a **"Volumes"** card or section
4. Or a **"+ Add Volume"** button

---

## Method 4: Use Railway CLI to Check

Even if you can't find the UI, you can check via CLI:

```bash
cd "/Users/sai/Warehouse management"

# Get Railway token first (see below)
export RAILWAY_TOKEN="your_token_here"

# Login
npx @railway/cli login --browserless $RAILWAY_TOKEN

# List volumes
npx @railway/cli volume list
```

This will show:
- ✅ If volumes exist → You'll see a list
- ❌ If no volumes → `No volumes found` or similar message

---

## How to Get Railway API Token

Since browser login doesn't work in terminal, you need an API token:

### Step-by-Step:

1. **Railway Dashboard** → Click your **profile picture or avatar** (top right corner)
2. Click **"Account Settings"** or **"Settings"**
3. Look for:
   - **"Tokens"** tab/section, or
   - **"API Tokens"**, or
   - **"Developer"** section
4. Click **"Create New Token"** or **"New Token"**
5. Give it a name (e.g., "CLI Access")
6. Click **"Create"**
7. **Copy the token immediately** (you can't see it again!)

### Use the token:
```bash
export RAILWAY_TOKEN="paste_your_copied_token_here"
npx @railway/cli login --browserless $RAILWAY_TOKEN
npx @railway/cli volume list
```

---

## What to Tell Me

After checking Railway Dashboard:

1. **In Settings tab**, do you see a "Volumes" section at the bottom?
   - Yes → What does it show?
   - No → Nothing there

2. **In Variables tab**, do you see `DATABASE_PATH`?
   - Should show: `DATABASE_PATH=/data/roster.db`

3. **Can you get an API token?**
   - If yes, we can use CLI to check/create volumes

---

## Alternative: Just Test if It Works

Since your logs show database is working at `/data/roster.db`, let's just test if it persists:

**See `TEST_DATA_PERSISTENCE.md` for the test steps.**

If data persists after a redeploy → Volume is working (even if you can't see it in UI)!

If data is lost after redeploy → We need to create the volume via CLI.

