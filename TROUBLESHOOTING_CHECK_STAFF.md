# Troubleshooting: "Check Staff" Shows Nothing

## Issue
After assigning staff to dates, clicking "Check Staff" shows nothing.

## Quick Fixes Applied

### 1. **Improved Error Handling**
- Added console logging to see API responses
- Better error messages
- Handles undefined/null arrays

### 2. **Better User Feedback**
- Shows "No scheduled dates found" instead of blank screen
- Shows "No schedule data found" if API fails

---

## How to Debug

### Step 1: Open Browser Console
1. Go to your deployed app: `https://warehouse-roster-system-production.up.railway.app/leader`
2. Open browser Developer Tools (F12 or Cmd+Option+I)
3. Go to "Console" tab

### Step 2: Test "Check Staff"
1. Click "Check Staff" tab
2. Click on a staff member
3. Check console for:
   - `Schedule API response:` - Should show the API response
   - `Setting schedule:` - Should show the processed data
   - Any error messages

### Step 3: Check What the API Returns

**Direct API Test:**
Visit this URL (replace `1` with actual staff ID):
```
https://warehouse-roster-system-production.up.railway.app/api/staff/1/schedule
```

Should return JSON like:
```json
{
  "success": true,
  "staff": {
    "id": 1,
    "name": "AJ",
    "phone": "12345678",
    "scheduledDates": ["2025-11-05", "2025-11-06"],
    "availableDates": ["2025-11-05", "2025-11-06", "2025-11-07"]
  }
}
```

---

## Common Issues & Solutions

### Issue 1: API Returns Empty Arrays
**Symptom:** Console shows `scheduledDates: []` and `availableDates: []`

**Possible Causes:**
- Staff hasn't been assigned to any dates yet
- Assignments were made but not saved
- Database connection issue

**Solution:**
1. Go back to "Plan Roster" tab
2. Assign staff to a date
3. Make sure you click "Save" after selecting staff
4. Check if assignments appear on calendar
5. Then try "Check Staff" again

### Issue 2: API Returns Error
**Symptom:** Console shows error or `success: false`

**Possible Causes:**
- Staff ID doesn't exist
- Database error
- API endpoint issue

**Solution:**
1. Check Railway logs: Railway Dashboard → Your Service → Logs
2. Verify staff exists: Visit `/api/staff` endpoint
3. Check database is accessible

### Issue 3: Data Structure Mismatch
**Symptom:** Console shows data but screen is blank

**Solution:** ✅ **Fixed!** The updated code now ensures arrays always exist

---

## Verify Data Was Saved

### Test Roster Assignment:
1. Go to "Plan Roster"
2. Click on a date (e.g., Nov 5)
3. Select staff members
4. Click "Save"
5. Verify staff names appear on the calendar for that date

### Test Schedule Retrieval:
1. Go to "Check Staff"
2. Click the same staff member you just assigned
3. Should see that date in "Scheduled Dates"

---

## Expected Behavior

After assigning staff:
- ✅ Calendar shows staff names under assigned dates
- ✅ "Check Staff" shows dates in "Scheduled Dates" section
- ✅ If staff marked available, shows in "Available Dates" section

---

## If Still Not Working

1. **Check Railway Logs:**
   - Railway Dashboard → Your Service → Logs
   - Look for errors when clicking "Check Staff"

2. **Test API Directly:**
   - Visit: `https://warehouse-roster-system-production.up.railway.app/api/staff/[id]/schedule`
   - Replace `[id]` with actual staff ID (usually 1, 2, 3, etc.)

3. **Check Database:**
   - Verify roster data is being saved
   - Check if `DATABASE_PATH` environment variable is set correctly

4. **Clear Browser Cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

## Latest Fix

The updated code (now deployed) includes:
- ✅ Console logging for debugging
- ✅ Better error handling
- ✅ Explicit array initialization
- ✅ Better user feedback messages

**Wait 1-2 minutes** for Railway to redeploy, then try again!

