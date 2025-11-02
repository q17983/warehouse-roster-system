# 🔄 Handling Duplicate Date Columns

## The Problem

Your Google Form keeps adding new columns, so you end up with:
- Columns D-J: Nov 3-9 (old form)
- Columns K-Q: Nov 10-16 (new week)
- Columns R-X: Nov 3-9 (staff used old form link again!)

When staff use an old form link, Google Sheets creates DUPLICATE columns for the same dates.

---

## How the System Handles This

### Step 1: Apps Script Groups by Date

The script now:
1. **Finds ALL columns** with "Available [Mon, Nov 3, 25]"
2. **Groups them by date:** 
   - Nov 3 → [column D, column R]
   - Nov 4 → [column E, column S]
   - etc.

### Step 2: Checks ALL Duplicate Columns

For each date:
- Checks column D (first Nov 3)
- Checks column R (duplicate Nov 3)
- **If EITHER shows "可以返 / Available", counts as available**

This way, **no matter which column staff fill out, their availability is captured!**

### Step 3: Only Next Week Data is Used

Even if staff fill out Nov 3-9 (old dates):
- Apps Script reads it successfully
- Sends to your web app
- **Brain.ts filters**: "Is Nov 3 in next week (Nov 10-16)?"
- **Answer: NO** → Ignores it
- Only Nov 10-16 data gets saved

---

## The Current Issue

**Staff "AC" filled out Nov 3-9 data (columns R-X)**

But system expects **Nov 10-16** data (columns K-Q).

**Solution:** Staff needs to fill out the CORRECT week's questions!

---

## How to Fix for This Week

### Option 1: Ask Staff to Re-submit
1. Send them the CURRENT form link
2. Form should show Nov 10-16 questions
3. Staff fills out columns K-Q
4. Process data again
5. Their availability appears!

### Option 2: Manually Adjust Google Sheet
1. Copy their responses from columns R-X
2. Paste into columns K-Q (matching Nov 10-16)
3. Process data
4. System reads the Nov 10-16 data

---

## How It Works Going Forward

**Updated Apps Script (after deployment):**
- ✅ Handles duplicate date columns automatically
- ✅ Checks ALL columns for each date
- ✅ If staff fills EITHER old or new column, it works
- ✅ No data loss from duplicate columns

**BUT**: System still only saves "next week" data (Nov 10-16).

So if staff submit for Nov 3-9 today (Nov 2), that data is ignored because Nov 3-9 is NOT "next week" (Nov 10-16).

---

## Preventing Future Issues

### Keep Form Updated:
1. **Every Monday:** Update form questions to next week's dates
2. Delete or hide old date questions
3. Share the NEW form link

### Or: Auto-Updating Form
I can help you create an Apps Script that automatically updates the form dates every week!

---

## For Your Current Situation

Since staff "AC" filled Nov 3-9 but you need Nov 10-16:

**Ask them to re-submit the form with Nov 10-16 dates.**

Or manually copy their Nov 3-9 responses to Nov 10-16 columns in the sheet (if you assume their availability is the same).

---

**The Apps Script fix is deployed to GitHub. Now you need to:**
1. **Update the Apps Script in Google Sheets** (copy from `google-apps-script.js`)
2. **Re-deploy the Web App** in Apps Script
3. Then it will handle duplicate columns properly!

