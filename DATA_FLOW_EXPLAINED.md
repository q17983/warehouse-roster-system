# How Data Flows From Google Sheets to Web App

## Current Data Flow (Step by Step)

### **Step 1: Staff Submit Form Responses**
- Staff fill out Google Form
- Responses automatically saved to Google Sheet tab: `[Form] Shift Applications`
- Data looks messy (duplicates, timestamps, etc.)

### **Step 2: Google Apps Script Processes Data**
- Apps Script reads from `[Form] Shift Applications` sheet
- Extracts: staff names, phone numbers, availability dates
- Removes duplicates
- Normalizes staff names
- Outputs clean JSON with structure:
  ```json
  {
    "staff": [{"name": "ACAC", "phone": "11111111"}, ...],
    "availability": [
      {"staffName": "ACAC", "date": "2025-11-03"},
      ...
    ]
  }
  ```

### **Step 3: Apps Script Deployed as Web App**
- Apps Script is deployed as a "Web App"
- When you call the Web App URL, it runs the script and returns fresh JSON
- URL: `https://script.google.com/macros/s/.../exec`
- **Important:** It processes data ON-DEMAND when you call the URL (fresh data every time!)

### **Step 4: Web App Fetches Data**
- When you click "Process Data" in Admin Panel
- Web app makes HTTP request to your Apps Script Web App URL
- Receives clean JSON data
- This happens at: `/api/process-data` endpoint

### **Step 5: "Brain" Processes Data**
- The `processCleanData()` function in `lib/brain.ts`:
  1. Syncs staff to SQLite database (creates or updates)
  2. Syncs availability dates to database
  3. Removes duplicates automatically

### **Step 6: Data Stored in SQLite**
- Local database file: `roster.db`
- Tables:
  - `staff` - Master list of all staff
  - `availability` - Who is available on which dates
  - `roster` - Leader's assignments (what you plan)

### **Step 7: Leader's App Reads from Database**
- Calendar view queries database for availability
- Shows only dates where staff said they're available
- Leader can assign staff to dates
- Assignments saved back to `roster` table

## Key Points

✅ **No Automatic Sync:** Data only syncs when you click "Process Data"
✅ **On-Demand Processing:** Apps Script runs when you fetch the URL (not scheduled)
✅ **Fresh Data:** Each "Process Data" gets the latest form responses
✅ **Local Storage:** All data stored in SQLite database locally

## Your Workflow

**Monday-Tuesday:** Send form to staff → They submit availability for NEXT week
**Wednesday:** Click "Process Data" → System syncs latest responses
**Wednesday-Sunday:** Plan roster using Leader's App

---

## Coming Next: Week-Based Filtering

We'll modify the system so it:
- Only shows availability for "next week" (Monday-Sunday)
- Automatically calculates which week to show
- Clears old availability when processing new data
- Defaults calendar to next week for planning

