# Quick Start Guide

## First Time Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Google Apps Script (No API Keys!)
1. Open your Google Sheet → **Extensions → Apps Script**
2. Copy ALL code from `google-apps-script.js` in this project
3. Paste into Apps Script, update CONFIG section
4. Deploy as Web App (Deploy → New Deployment → Web App)
5. Copy the Web App URL

### 3. Create `.env.local` file
```env
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/YOUR_URL_HERE
DATABASE_PATH=./roster.db
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Process Your Data
1. Open http://localhost:3000/admin
2. The Web App URL from `.env.local` will be used automatically
3. Click "Process Data"

### 6. Start Planning!
1. Go to http://localhost:3000/leader
2. Tap dates to assign staff
3. Switch to "Check Staff" to view schedules

## Daily Workflow

### For Your Warehouse Leader:
1. Open the Leader's App on their phone/tablet
2. Tap a date → Select staff → Save
3. Done in seconds!

### For You (Admin):
1. When new form responses arrive
2. Go to Admin Panel
3. Click "Process Data"
4. That's it!

## Your Google Form Setup

Keep using your existing Google Form! The system reads from the sheet automatically.

Make sure your form collects:
- ✅ Phone number
- ✅ Full name (中文全名)
- ✅ Availability for each day

The system automatically recognizes both English ("Available") and Chinese ("可以返") responses.

