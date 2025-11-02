# 🧪 Test Data Persistence on Railway

## Quick Test (5 minutes)

Follow these steps to verify if your data persists:

### Step 1: Add Some Data
1. Go to: `https://warehouse-roster-system-production.up.railway.app/admin`
2. Click **"Process Data"**
3. Wait for success message

### Step 2: Assign Staff to a Date
1. Go to: `https://warehouse-roster-system-production.up.railway.app/leader`
2. Click **"Plan Roster"** tab
3. Click on any date (e.g., Monday)
4. Select 2-3 staff members
5. Click **"Save"**
6. You should see "Roster saved!"

### Step 3: Check the Debug Endpoint
1. Visit: `https://warehouse-roster-system-production.up.railway.app/api/debug/db`
2. **Note these numbers:**
   - `staffCount`: _____ (write it down)
   - `availabilityCount`: _____
   - `rosterCount`: _____ (should be > 0 if you assigned staff)

### Step 4: Verify Check Staff Works
1. Go back to: `https://warehouse-roster-system-production.up.railway.app/leader`
2. Click **"Check Staff"** tab
3. Click on a staff member you assigned
4. **You should see the date you assigned them to**

### Step 5: Wait 10 Minutes
- Just wait 10 minutes
- Don't close the Railway page
- Don't make any changes

### Step 6: Check Again
1. Visit debug endpoint again: `https://warehouse-roster-system-production.up.railway.app/api/debug/db`
2. **Compare the numbers:**
   - `staffCount`: Should be THE SAME ✅
   - `availabilityCount`: Should be THE SAME ✅
   - `rosterCount`: Should be THE SAME ✅

### Step 7: Force a Redeploy
1. Railway Dashboard → Your Service
2. Click **"Deployments"** tab (top menu)
3. Click the **three dots (•••)** on the latest deployment
4. Click **"Redeploy"**
5. Wait 2-3 minutes for redeploy to complete

### Step 8: Check After Redeploy
1. Visit debug endpoint: `https://warehouse-roster-system-production.up.railway.app/api/debug/db`
2. **Are the numbers still the same?**
   - ✅ **YES** → Volume is working! Data persists!
   - ❌ **NO (all zeros)** → Volume doesn't exist, data is ephemeral

---

## Results

### If numbers stayed the same after redeploy ✅
**Congratulations!** Your volume is working correctly. Data is persisting.

You don't need to do anything else. The system is working!

### If numbers went to zero after redeploy ❌
The volume doesn't exist or isn't mounted. You need to create it.

**Next step:** Get a Railway API token and create the volume via CLI.

---

## Quick Check Without Waiting

Just do Steps 1-4 now, then tell me:
1. What does `/api/debug/db` show? (especially `rosterCount`)
2. Does "Check Staff" show the assigned dates?

If both work, we just need to test persistence with a redeploy.

