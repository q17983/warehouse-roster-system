# ✅ Post-Volume Setup Checklist

## 🎉 Deployment Complete! Now Let's Verify Everything Works

---

## Step 1: Verify Volume is Set Up ✅

### Check Railway Logs:
1. Go to **Railway Dashboard** → Your Service → **Logs** tab
2. Look for this message:
   ```
   [Database] Initializing database at: /data/roster.db
   ```
3. ✅ **If you see `/data/roster.db`** → Volume is working!
4. ❌ **If you see `./roster.db`** → Volume not set up, go back and create it

### Check Environment Variables:
1. Railway Dashboard → Your Service → **Variables** tab
2. Look for: `DATABASE_PATH=/data/roster.db`
3. ✅ Should be set to `/data/roster.db`
4. ❌ If missing or different → Set it manually in Variables tab

---

## Step 2: Process Your Data 📊

### In Admin Panel:
1. Go to: `https://warehouse-roster-system-production.up.railway.app/admin`
2. Check if **Web App URL is pre-filled** (should show your Apps Script URL)
3. Click **"Process Data"** button
4. Wait for success message showing:
   - Staff Processed: (number)
   - Availability Records: (number)

### Verify Data Was Processed:
- Visit: `https://warehouse-roster-system-production.up.railway.app/api/staff`
- Should return JSON with staff list
- If empty → Data wasn't processed, try again

---

## Step 3: Assign Staff to Dates 📅

### In Leader's App:
1. Go to: `https://warehouse-roster-system-production.up.railway.app/leader`
2. You should see calendar showing next week (Mon-Sun)
3. Click on any date (e.g., "Nov 5")
4. Modal opens → Select staff members
5. Click **"Save"**
6. Staff names should appear on the calendar for that date

---

## Step 4: Test "Check Staff" Feature ✅

### This is the Critical Test:
1. In Leader's App, click **"🔍 Check Staff"** tab
2. Click on a staff member you just assigned
3. ✅ **Should show:**
   - "Scheduled Dates" section with dates you assigned
   - "Available Dates" section (if they submitted availability)
4. ❌ **If shows nothing:**
   - Check Railway logs for errors
   - Verify staff was actually assigned (go back to calendar view)
   - Check browser console (F12) for errors

---

## Step 5: Test Database Persistence 🔄

### This Verifies Volume is Working:
1. **Process data** → **Assign staff** → **Check staff** (should work)
2. **Trigger a redeploy** (push a small code change OR manually redeploy in Railway)
3. Wait 2-3 minutes for redeploy
4. **Go back to Leader's App**
5. ✅ **Data should still be there!**
   - Staff list should still show
   - Assigned dates should still show
   - No need to re-process data

❌ **If data is gone after redeploy:**
   - Volume is NOT working
   - Check Railway logs for database path
   - Verify `DATABASE_PATH=/data/roster.db` is set

---

## 🎯 Quick Verification Checklist

- [ ] Railway logs show `/data/roster.db` path
- [ ] `DATABASE_PATH` environment variable is set correctly
- [ ] Admin panel pre-fills webapp URL correctly
- [ ] Can process data successfully
- [ ] Can assign staff to dates
- [ ] "Check Staff" shows scheduled dates
- [ ] Data persists after redeploy

---

## 🐛 Troubleshooting

### "Check Staff" Shows Nothing:

1. **Check Railway Logs:**
   - Look for `[Schedule API]` messages
   - Look for `[RosterModel]` messages
   - Check for any errors

2. **Test API Directly:**
   ```
   https://warehouse-roster-system-production.up.railway.app/api/staff/1/schedule
   ```
   Replace `1` with actual staff ID. Should return JSON with `scheduledDates` array.

3. **Verify Staff Was Assigned:**
   - Go back to calendar
   - Make sure staff names appear on dates
   - If not, the assignment didn't save

### Database Path Wrong:

If logs show `./roster.db` instead of `/data/roster.db`:
1. Railway Dashboard → Variables
2. Add/Edit: `DATABASE_PATH=/data/roster.db`
3. Railway will redeploy automatically

### Volume Not Created:

If you skipped the volume creation step:
1. Run: `npx @railway/cli volumes create data --mount /data`
2. Then set: `DATABASE_PATH=/data/roster.db`
3. Redeploy

---

## ✅ Success Indicators

**Everything is working if:**
- ✅ Can process data
- ✅ Can assign staff
- ✅ "Check Staff" shows scheduled dates
- ✅ Data persists after redeploy
- ✅ No errors in Railway logs

**You're all set!** 🎉

---

## 🚀 Next Steps (Once Everything Works)

1. **Set up auto-sync** (optional but recommended):
   - Apps Script → Add `autoSyncToWebApp()` function
   - Set up hourly trigger
   - Data will sync automatically every hour

2. **Share with your leader:**
   - Give them the Leader's App URL
   - They can bookmark it on their iPhone
   - Start planning rosters!

3. **Monitor:**
   - Check Railway logs periodically
   - Verify data is syncing correctly
   - Test after each redeploy to ensure persistence

---

**Ready to test? Start with Step 1 above!** 🔍

