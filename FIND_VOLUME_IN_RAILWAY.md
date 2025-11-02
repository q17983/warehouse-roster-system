# How to Find Volumes in Railway

## Method 1: Through Settings Tab

1. **Go to Railway Dashboard:** https://railway.app
2. **Click on your project** (`warehouse-roster-system`)
3. **Click on your service** (should be something like `warehouse-roster-system` or `web`)
4. **Click on "Settings" tab** (top menu bar, next to "Variables", "Metrics", etc.)
5. **Scroll down** - Look for a section called **"Volumes"** or **"Storage"**
6. **Click "New Volume"** button

---

## Method 2: Alternative UI Locations

Railway sometimes moves things around. Try these:

### Option A: In the Service Overview
- Click your service
- Look for a **"Storage"** or **"Volumes"** card/widget
- Or check the right sidebar

### Option B: Through Service Configuration
- Service → **"Settings"** → Look for **"Resources"** or **"Infrastructure"** section

### Option C: Service → "Settings" → Bottom of page
- Sometimes Volumes are at the very bottom of the Settings page

---

## Method 3: If You Still Can't Find It

### Check Your Railway Plan
- Free tier might not have volumes
- Hobby/Developer plan should have volumes
- Check: Railway Dashboard → Account/Billing → see your plan

### Alternative: Contact Railway Support
- If volumes aren't available, you can use the default `/tmp` directory temporarily
- But `/data` is better for persistence

---

## Screenshot Guide (What to Look For)

Look for any of these terms in your Railway dashboard:
- ✅ **"Volumes"**
- ✅ **"Storage"**
- ✅ **"Persistent Storage"**
- ✅ **"File System"**
- ✅ **"Mount Points"**

---

## Quick Check: Are You in the Right Place?

1. ✅ You're logged into Railway
2. ✅ You're in your project (`warehouse-roster-system`)
3. ✅ You clicked on the SERVICE (not just the project)
4. ✅ You're in the "Settings" tab

If all checked, volumes should be visible. If not, it might be a plan limitation or UI update.

---

## Temporary Workaround (If No Volumes)

If you can't find/create volumes, we can use a different database path:
- Use `DATABASE_PATH=./roster.db` (default)
- **Warning:** Data will be lost if Railway restarts your service
- But it will work for testing

For production, volumes are recommended!

