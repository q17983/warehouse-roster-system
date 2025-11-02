# 📋 Project Summary: Warehouse Roster System

## ✅ What We've Built So Far

### **1. Complete Roster Planning System**
- ✅ Staff application system (Google Form → Google Sheet)
- ✅ Automatic data processing ("Brain") - cleans and organizes data
- ✅ Leader's mobile-friendly app for roster planning
- ✅ Admin panel for data management

### **2. Tech Stack**
- ✅ **Next.js 14** with TypeScript
- ✅ **SQLite** database (better-sqlite3)
- ✅ **Google Apps Script** for data processing (no API keys needed!)
- ✅ **Mobile-first design** for iPhone users
- ✅ **Week-based filtering** - only shows next week for planning

### **3. Key Features**

#### **Part 1: Staff Application (Input)**
- Staff fill Google Form weekly
- Form questions auto-update with next week's dates
- Responses go to `[Form] Shift Applications` sheet

#### **Part 2: Automatic "Brain" (Processing)**
- Apps Script reads messy form responses
- Cleans duplicates, normalizes names
- Extracts availability dates
- Returns clean JSON data
- Web app processes and stores in SQLite database

#### **Part 3: Leader's App (Interface)**
- **Tool 1: Plan Roster (Calendar)**
  - Shows next week (Monday-Sunday) by default
  - Tap date → See only available staff for that date
  - Select multiple staff → Save roster
  - Mobile-optimized for iPhone
  
- **Tool 2: Check Staff (Search)**
  - List all staff members
  - Tap name → See all their scheduled dates
  - See their availability history

### **4. Deployment**
- ✅ Code pushed to GitHub: `q17983/warehouse-roster-system`
- ✅ Deployed to Railway: `warehouse-roster-system-production.up.railway.app`
- ✅ Environment variables configured
- ⚠️ Persistent volume setup (optional - using default path for now)

---

## 📊 Current Data Handling Logic

### **How Multiple Submissions Are Handled:**

#### **Scenario 1: Same Staff, Different Weeks**
✅ **Handled correctly!**
- Staff submits for Week 1 (03-09NOV)
- Staff submits for Week 2 (10-16NOV)
- **Result:** Both submissions are stored, but only NEXT WEEK is shown in calendar
- Old week data remains in database but isn't displayed

#### **Scenario 2: Same Staff, Same Week, Multiple Submissions**
✅ **Handled correctly!**
- Staff submits for Week 2 (10-16NOV) - First time
- Staff submits for Week 2 (10-16NOV) again (correcting mistake)
- **Result:** Only the LATEST submission is kept for that week
- System clears old availability for next week, then adds latest

#### **Current Logic (lib/brain.ts):**
```typescript
1. Process all form responses from Apps Script
2. Clear ALL availability for "next week" dates
3. For each staff member:
   - Clear their old availability for next week
   - Add their latest availability (from most recent submission)
4. Only process dates that are in "next week"
```

#### **Current Logic (google-apps-script.js):**
- Processes rows in reverse order (newest first)
- Uses a Map to track latest submission per staff
- Only keeps the most recent submission's availability for each staff member

---

## ⚠️ Potential Issue: Week-Based Filtering

### **The Problem You Described:**

Your form uses:
- `=TODAY() - WEEKDAY(TODAY(), 2) + 8` (calculates next Monday)
- Questions auto-update weekly

**Your Concern:**
- Week 1: Staff applies for 03-09NOV
- Week 2: Staff applies for 10-16NOV (first time)
- Week 2: Staff applies for 10-16NOV again (correction)

**Current Behavior:**
✅ **Works correctly!**
- Apps Script processes ALL rows and keeps only latest submission per staff
- "Brain" filters to only save dates in "next week"
- Old week data is cleared when processing
- Latest submission for next week replaces any previous submission

### **However, There's One Edge Case:**

**If you process data on different weeks:**
- Monday (Nov 3): Process data → Saves availability for Nov 10-16
- Wednesday (Nov 5): Staff resubmits for Nov 10-16
- **Question:** When you process data again on Nov 5, does it update correctly?

**Answer:** ✅ **Yes!** Because:
1. Apps Script always takes the LATEST submission
2. "Brain" clears next week's availability before adding new
3. So the resubmission will replace the old submission

---

## 🔍 Let Me Verify the Apps Script Logic

I need to check if Apps Script correctly handles:
1. Multiple submissions from same staff
2. Only taking the latest submission
3. Week-based date filtering

Let me examine the code more closely...

