# Week-Based Roster Planning System

## How It Works Now

### **Your Workflow:**
1. **Monday-Tuesday:** Send Google Form to staff asking for NEXT week's availability
2. **Wednesday:** Click "Process Data" in Admin Panel → System syncs latest responses
3. **Wednesday-Sunday:** Plan roster using Leader's App (defaults to next week view)

### **What Changed:**

#### 1. **Data Processing (lib/brain.ts)**
- ✅ Only processes availability for **next week** (Monday-Sunday)
- ✅ Automatically calculates which dates are "next week"
- ✅ Clears old availability for next week before adding new data
- ✅ Ignores availability dates outside next week

**Example:**
- Today: November 3 (Monday)
- Next week: November 10-16 (Monday-Sunday)
- System only saves availability for Nov 10-16
- Availability for other dates is ignored

#### 2. **Calendar View (Leader's App)**
- ✅ Defaults to showing **next week** when you open it
- ✅ Shows Monday-Sunday (7 days) instead of 14 days
- ✅ Displays "📅 Planning Next Week" indicator
- ✅ Has "Jump to Next Week" button if you navigate away
- ✅ Still allows navigating to other weeks (for viewing past rosters)

#### 3. **Week Calculation**
- Uses helper functions in `lib/weekUtils.ts`
- **Next week** = The Monday-Sunday period that starts next Monday
- Automatically calculated from today's date

## Data Flow (Updated)

```
1. Staff submit form → Google Sheet ([Form] Shift Applications)
2. Click "Process Data" → Apps Script processes data
3. Apps Script returns ALL availability dates
4. "Brain" filters: Only saves dates that are in "next week"
5. Database: Only contains next week's availability
6. Calendar: Shows next week by default
7. Leader plans roster for next week only
```

## Testing

**To test the week filtering:**

1. **Process your current test data:**
   - Click "Process Data" in Admin Panel
   - Check the stats - it should show only next week's availability count

2. **Check the calendar:**
   - Open Leader's App
   - Should default to next week (Monday-Sunday)
   - Should show "📅 Planning Next Week" indicator
   - Only dates in next week should have available staff

3. **Verify availability:**
   - Tap a date in next week → Should see available staff
   - Tap a date outside next week → Should show "No staff available" (correct!)

## Key Benefits

✅ **Cleaner data** - Only relevant week's availability  
✅ **Faster planning** - Defaults to the week you're planning  
✅ **Automatic calculation** - No manual date selection needed  
✅ **Focused view** - See only what matters for this planning cycle  

## Important Notes

- **Old data:** When you process new data, it clears next week's old availability first
- **Roster assignments:** Can still be made for any date, but availability is only shown for next week
- **Past weeks:** Can navigate to past weeks to view historical rosters, but no availability shown
- **Future weeks beyond next week:** Can navigate but won't have availability until you process data for that week

---

## Next Steps

The system is now configured for your weekly workflow:
1. Send form Monday-Tuesday
2. Process data Wednesday
3. Plan roster Wednesday-Sunday
4. System automatically shows next week!

