# Google Apps Script Setup Guide

Since you can't create service account keys due to organization policy, we'll use Google Apps Script instead. This is actually simpler and runs automatically!

## Quick Setup (5 minutes)

### Step 1: Copy the Script

1. Open your Google Sheet (the one with form responses)
2. Go to **Extensions → Apps Script**
3. Delete any existing code
4. Open the file `google-apps-script.js` from this project
5. Copy ALL the code and paste it into Apps Script

### Step 2: Configure the Script

At the top of the script, find the `CONFIG` section and update:

```javascript
const CONFIG = {
  FORM_SHEET_NAME: '[Form] Shift Applications',  // Your form responses sheet name
  CLEAN_SHEET_NAME: 'Clean_Data',               // Will be created automatically
  STAFF_LIST_SHEET: 'Staff List',               // Optional
  WEB_APP_MODE: false,                          // Set to true for Web App method
};
```
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
read_file

### Step 3: Choose Your Method

#### **Method 1: Web App (Recommended - Easiest)**

1. In Apps Script, click **Deploy → New Deployment**
2. Click the gear icon ⚙️ → Select **Web app**
3. Settings:
   - **Execute as:** Me
   - **Who has access:** Anyone (or "Anyone with Google account")
4. Click **Deploy**
5. **Copy the Web app URL** (looks like: `https://script.google.com/macros/s/...`)
6. Save this URL - you'll use it in your `.env.local` file:

```env
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL_HERE
```

**That's it!** The Web App will automatically return clean JSON data whenever you call it.

#### **Method 2: Automatic CSV Export (Alternative)**

1. In Apps Script, click **Run → Trigger → Add Trigger**
2. Configure:
   - **Function:** `processFormData`
   - **Event source:** Time-driven
   - **Type:** Minutes timer
   - **Interval:** Every 5 minutes (or 15 minutes)
3. Click **Save** (you'll need to authorize it the first time)
4. This will automatically process data every few minutes and write to "Clean_Data" sheet
5. Publish the "Clean_Data" sheet:
   - Right-click on "Clean_Data" tab → Publish to web → CSV
   - Copy the CSV URL
6. Add to `.env.local`:

```env
GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/.../export?format=csv&gid=...
```

### Step 4: Test It

1. In Apps Script, click **Run → testProcess**
2. Check the execution log to see if it works
3. If using Method 2, check that "Clean_Data" sheet was created

### Step 5: Use in Your App

1. Create `.env.local` file with your URL:

```env
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL_HERE
DATABASE_PATH=./roster.db
```

2. Start your app: `npm run dev`
3. Go to `/admin` and click "Process Data"

## How It Works

The Apps Script:
- ✅ Reads your messy form responses
- ✅ Removes duplicates
- ✅ Normalizes staff names
- ✅ Extracts availability dates
- ✅ Outputs clean JSON or CSV

Your web app:
- ✅ Fetches the cleaned data
- ✅ Stores it in SQLite database
- ✅ Makes it available to the Leader's App

## Troubleshooting

**"Authorization required"**
- Click "Review permissions" when Apps Script asks
- Choose your Google account
- Click "Advanced" → "Go to [Project Name] (unsafe)" (if shown)
- Click "Allow"

**Script doesn't run automatically**
- Check that trigger is set up correctly
- Look in Apps Script → Executions to see if it's running
- Check for errors in the execution log

**Web App returns error**
- Make sure you set "Who has access" to "Anyone" or "Anyone with Google account"
- Try running `testProcess` function manually first

**Data not updating**
- If using Method 1, the Web App URL fetches fresh data every time
- If using Method 2, wait a few minutes for the trigger to run

## Benefits of This Approach

- ✅ No service account needed
- ✅ Runs automatically every few minutes
- ✅ Processes data inside Google Sheets (faster)
- ✅ No API quotas to worry about
- ✅ Works with any Google account

## Advanced: Custom Schedule

If you want the script to run at specific times:

1. In Apps Script → Triggers
2. Change trigger type to "Time-driven → Day timer"
3. Set specific time (e.g., "Midnight to 1am")
4. This runs once per day instead of every few minutes

Perfect for processing data once per day!

