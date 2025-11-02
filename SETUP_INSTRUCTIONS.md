# Complete Setup Instructions

## Step-by-Step Guide Using "[Form] Shift Applications" Sheet

### ✅ Step 1: Install Dependencies (Already Done!)

Your dependencies are already installed. You can skip this step.

---

### ✅ Step 2: Set Up Google Apps Script (5 minutes)

#### 2.1 Copy the Script

1. **Open your Google Sheet** (the "Warehouse Admin" sheet with form responses)
2. **Go to Extensions → Apps Script**
   - If you see a default `Code.gs` file, delete all its contents
3. **Open the file** `google-apps-script.js` from this project folder
4. **Copy ALL the code** (Ctrl+A / Cmd+A, then Ctrl+C / Cmd+C)
5. **Paste it into Apps Script** (Ctrl+V / Cmd+V)

#### 2.2 Configure the Script

The script is already configured with your sheet name `[Form] Shift Applications`, but let's verify:

Look for this section near the top:

```javascript
const CONFIG = {
  FORM_SHEET_NAME: '[Form] Shift Applications',  // ✅ This is correct!
  CLEAN_SHEET_NAME: 'Clean_Data',
  STAFF_LIST_SHEET: 'Staff List',
  WEB_APP_MODE: false,
};
```

✅ **No changes needed** - it's already set to `[Form] Shift Applications`!

#### 2.3 Save the Script

1. Click **Save** (💾 icon or Ctrl+S / Cmd+S)
2. Give your project a name like "Roster Processor" (click the project name at the top)

---

### ✅ Step 3: Deploy as Web App (Recommended Method)

#### 3.1 Deploy

1. In Apps Script, click **Deploy → New Deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure settings:
   - **Description:** (optional) "Roster Data Processor"
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone** (this allows your app to access it)
5. Click **Deploy**
6. **IMPORTANT:** Copy the **Web app URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
   ⚠️ **Save this URL somewhere - you'll need it in the next step!**

#### 3.2 Authorize (First Time Only)

- Apps Script may ask you to authorize
- Click **Review permissions**
- Choose your Google account
- Click **Advanced** → **Go to [Project Name] (unsafe)** (if shown)
- Click **Allow**

---

### ✅ Step 4: Create Environment File

1. In your project folder, create a new file named: `.env.local`
   - Make sure it starts with a dot (`.`)
   - No extension needed

2. Add this content (replace with YOUR Web App URL from Step 3):

```env
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL_HERE
DATABASE_PATH=./roster.db
```

**Example:**
```env
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycby1234567890/exec
DATABASE_PATH=./roster.db
```

⚠️ **Important:** 
- Replace `YOUR_URL_HERE` with the actual URL you copied from Step 3
- Make sure there are no spaces around the `=` sign
- The URL should end with `/exec`

---

### ✅ Step 5: Start Your App

1. Open terminal/command prompt
2. Navigate to your project folder:
   ```bash
   cd "/Users/sai/Warehouse management"
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. You should see:
   ```
   ▲ Next.js 14.x.x
   - Local:        http://localhost:3000
   ```
5. ✅ **Your app is running!**

---

### ✅ Step 6: Process Your Data (First Time)

1. **Open your browser** and go to: `http://localhost:3000/admin`
2. You should see the **Admin Panel**
3. The form will automatically use the URL from your `.env.local` file
4. Click the **"Process Data"** button
5. Wait a few seconds...
6. You should see:
   - ✅ **Success** message
   - **Stats showing:**
     - Staff Processed: (number)
     - Availability Records: (number)

🎉 **Congratulations!** Your data is now in the database!

---

### ✅ Step 7: Start Planning Rosters!

1. Go to: `http://localhost:3000/leader`
2. You'll see the **Leader's App** with a calendar
3. **Try it out:**
   - Tap any date
   - See available staff for that date
   - Select staff members
   - Click "Save"
4. Switch to **"Check Staff"** view to see individual schedules

---

## Daily Workflow

### For Your Warehouse Leader:
1. Open `http://localhost:3000/leader` on their phone/tablet
2. Tap a date → Select staff → Save
3. Done in seconds! ⚡

### For You (When New Form Responses Come In):
1. Open `http://localhost:3000/admin`
2. Click **"Process Data"** button
3. Wait 2-3 seconds
4. Done! ✅

The Apps Script automatically processes your `[Form] Shift Applications` sheet data and makes it ready for the roster system.

---

## Troubleshooting

### ❌ "Web App URL not found"
- Make sure you copied the entire URL from Apps Script
- Check that `.env.local` file exists and has the correct format
- Make sure there are no extra spaces

### ❌ "Authorization required" in Apps Script
- Click "Review permissions"
- Choose your Google account
- Click "Allow"

### ❌ "No data found"
- Make sure your sheet tab is exactly named: `[Form] Shift Applications`
- Check that the sheet has form response data
- Try running `testProcess` function in Apps Script first (Run → testProcess)

### ❌ "Error fetching data"
- Check your Web App deployment settings:
  - Execute as: **Me**
  - Who has access: **Anyone**
- Try opening the Web App URL directly in browser - it should show JSON data

---

## Summary Checklist

- [ ] Copied Apps Script code into Google Sheet
- [ ] Verified CONFIG has `[Form] Shift Applications`
- [ ] Deployed as Web App
- [ ] Copied Web App URL
- [ ] Created `.env.local` file with URL
- [ ] Started app with `npm run dev`
- [ ] Processed data in Admin Panel
- [ ] Tested Leader's App at `/leader`

**You're all set!** 🎉

