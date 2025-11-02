# Warehouse Roster System

A simple, mobile-friendly web application for managing staff rosters. This system replaces cumbersome Google Sheets with an intuitive interface designed for warehouse leaders.

## Features

### Part 1: Staff Application (Input)
- Staff submit availability through Google Forms (existing setup)
- Data is automatically collected in Google Sheets

### Part 2: Automatic "Brain" (Processing)
- Automatically processes Google Sheets form responses
- Cleans and deduplicates staff data
- Creates a clean database of staff and their availability

### Part 3: Leader's App (Interface)
- **Tool 1: Plan the Roster** - Calendar view where leaders can:
  - Tap any date to see available staff
  - Select multiple staff members in seconds
  - Save roster assignments instantly
- **Tool 2: Check Staff Schedule** - Search dashboard where leaders can:
  - View all staff members
  - See each staff member's scheduled and available dates

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to your Google Sheet with form responses

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Apps Script (No API Keys Needed!)

**This is much simpler than using Google Sheets API and works even if your organization blocks service accounts!**

See **[APPS_SCRIPT_SETUP.md](./APPS_SCRIPT_SETUP.md)** for detailed step-by-step instructions.

**Quick version:**
1. Open your Google Sheet → **Extensions → Apps Script**
2. Copy the code from `google-apps-script.js` in this project
3. Deploy as Web App (recommended) or set up automatic CSV export
4. Copy the Web App URL

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# Option 1: Web App URL (Recommended - Easiest)
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/...

# Option 2: CSV URL (Alternative - if using CSV export method)
GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/.../export?format=csv

# Database location
DATABASE_PATH=./roster.db
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Process Data (First Time Setup)

1. Navigate to the Admin Panel at `http://localhost:3000/admin`
2. Either:
   - Use the URLs from your `.env.local` file (automatic), OR
   - Paste your Apps Script Web App URL or CSV URL in the form
3. Click "Process Data" to sync cleaned data from Apps Script

## Usage

### For Leaders

1. Go to `/leader` to access the Leader's App
2. **Plan Roster:**
   - View the calendar showing 2 weeks at a time
   - Tap any date to see available staff
   - Select staff members for that date
   - Click "Save" to assign them
3. **Check Staff Schedule:**
   - Switch to "Check Staff" view
   - Tap a staff member's name
   - View their scheduled and available dates

### For Admins

1. Go to `/admin` to access the Admin Panel
2. Click "Process Data" whenever you need to sync new form responses from Google Sheets
3. The system will automatically:
   - Read all form responses
   - Clean and deduplicate staff names
   - Update availability records

## Technology Stack

- **Next.js 14** - React framework with API routes
- **TypeScript** - Type-safe development
- **SQLite (better-sqlite3)** - Simple, file-based database
- **Google Apps Script** - Process and clean form data (no API keys needed!)
- **date-fns** - Date manipulation
- **CSS Modules** - Scoped styling

## Project Structure

```
├── app/
│   ├── api/              # API endpoints
│   ├── leader/           # Leader's app interface
│   ├── admin/            # Admin panel
│   └── page.tsx          # Home page
├── lib/
│   ├── database.ts       # Database setup
│   ├── models.ts         # Data models
│   ├── brain.ts          # Data processing logic
│   ├── googleSheets.ts   # Google Sheets integration
│   └── init.ts           # Database initialization
└── package.json
```

## Database Schema

- **staff** - Master list of all staff members
- **availability** - Clean list of who is available on what date
- **roster** - Leader's roster assignments

## Deployment

For production deployment:

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Consider deploying to:
   - Vercel (recommended for Next.js)
   - Railway
   - DigitalOcean App Platform
   - Any Node.js hosting service

## Notes

- The database file (`roster.db`) is created automatically on first run
- Google Sheets processing can be run on-demand from the admin panel
- The system is designed to be mobile-friendly for use on tablets and phones
- All roster data is stored locally in SQLite - consider backups for production use

## Troubleshooting

**Apps Script errors:**
- Make sure you've deployed the Web App with "Anyone" access
- Check Apps Script execution log for errors
- Verify the CONFIG section matches your sheet names
- Try running `testProcess` function manually in Apps Script

**Web App URL not working:**
- Make sure deployment settings: "Execute as: Me" and "Who has access: Anyone"
- Check that the URL is the Web App URL, not the editor URL

**Database errors:**
- Delete `roster.db` and restart the application to recreate
- Check file permissions in the project directory

**No staff showing in availability:**
- Run "Process Data" in the admin panel first
- Check that your Google Sheet has form responses
- Verify the sheet name matches your form responses tab

