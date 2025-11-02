# 📊 Data Management Guide

## Understanding Data Flow

### Google Sheet → Your System

**Important:** Your system stores data in PostgreSQL database, NOT Google Sheet!

```
Google Sheet (Source) → Process Data → PostgreSQL (Storage)
                                           ↓
                              Leader App reads from here
```

**This means:**
- ❌ Deleting rows from Google Sheet does NOT delete from database
- ✅ Database keeps historical data until you manually clear it
- ✅ Processing data ADDS/UPDATES staff, doesn't remove old ones

---

## How to Remove Old Test Data

### Method 1: Use "Clear All Data" Button (Easiest)

**After deployment completes:**

1. Go to Admin Panel
2. You'll see a new **"🗑️ Clear All Data"** button (red button next to "Process Data")
3. Click it
4. Confirm the warning
5. All test data is deleted (staff, availability, roster)
6. Click **"Process Data"** to reload ONLY the real data from Google Sheet

### Method 2: Delete Individual Staff

In Admin Panel → Manage Staff:
1. Click **"Delete"** button next to each test staff member
2. This removes that staff and all their availability/roster data
3. Keep only the real staff

---

## Transition from Test to Real Data

### Step-by-Step Process:

**1. Clean Your Google Sheet:**
- Delete all test response rows
- Keep only real staff responses
- Make sure dates are correct (Nov 10-16)

**2. Clear Database:**
- Admin Panel → Click **"🗑️ Clear All Data"**
- Confirm deletion

**3. Process Real Data:**
- Click **"Process Data"**
- System loads ONLY real staff from Google Sheet

**4. Verify:**
- Check "Manage Staff" - should show only real staff
- Check Leader App - should show only real data

---

## "Next Week" Date Range

**After latest fix, system now expects:**
- Today: Nov 2 (Saturday)
- **Next Week:** Nov 10-16 (Monday to Sunday)

This matches your Google Sheet formula: `=TODAY() - WEEKDAY(TODAY(), 2) + 8`

**To verify:** Visit `/api/debug/next-week` to see what dates system is processing

---

## Why Old Data Persists

**The database is separate from Google Sheet:**

| Google Sheet | PostgreSQL Database |
|--------------|-------------------|
| Form responses (raw data) | Processed, clean data |
| You can delete rows | Data stays until you clear it |
| Source of truth | What the app uses |

**Workflow:**
1. Staff → Fill Google Form → Saves to Sheet
2. You → Process Data → Copies to database
3. Leader → Uses app → Reads from database (NOT Sheet)

**Deleting from Sheet only prevents that data from being re-imported. Existing database records remain.**

---

## Managing Data Going Forward

### Weekly Process:
1. Staff submit availability (Monday-Tuesday)
2. **You process data** (Wednesday)
   - This UPDATES existing staff
   - ADDS new staff
   - UPDATES availability for next week
3. Leader plans roster (Wednesday-Friday)

### If Staff Make Mistakes:
- They submit form again (latest submission wins)
- You process data again
- System updates with latest info

### If You Need to Remove Someone:
- Admin Panel → Manage Staff → Delete
- Or use "Clear All Data" and re-process

---

## Quick Actions

### Remove All Old Test Data:
1. Click "🗑️ Clear All Data"
2. Click "Process Data"
3. Done!

### Remove One Test Staff:
1. Manage Staff → Find them
2. Click "Delete"
3. Confirm

### Start Fresh Each Week:
- You don't need to clear data!
- Just process data weekly
- Old availability is replaced automatically

---

## After Deployment

The "Clear All Data" button will appear in Admin Panel.

**Use it to:**
- Remove all test data
- Start fresh with real staff
- Reset if data gets messy

**Then:** Process Data to reload from Google Sheet!

