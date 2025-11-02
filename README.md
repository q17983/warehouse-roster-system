# Warehouse Roster Planning System

A simple, mobile-friendly staff roster management system for warehouse operations.

## 🌟 Features

- **Staff Application:** Google Form for weekly availability submissions
- **Automated Processing:** Clean and organize form data automatically
- **Mobile-First Leader App:** Simple interface optimized for iPhone
- **Smart Calendar:** See only available staff when planning
- **Staff Search:** Instantly check any staff member's schedule
- **Week-Based Planning:** Focus on next week's roster (Monday-Sunday)

---

## 🚀 Quick Start

### Live URLs

**Admin Panel:** https://warehouse-roster-system-production.up.railway.app/admin

**Leader App:** https://warehouse-roster-system-production.up.railway.app/leader

### First Time Setup

1. **Set up Google Apps Script** (see `APPS_SCRIPT_SETUP.md`)
2. **Process Data** in Admin Panel
3. **Start Planning** in Leader App

---

## 📋 Weekly Workflow

1. **Monday-Tuesday:** Send Google Form to staff for next week
2. **Wednesday:** Process data in Admin Panel
3. **Wednesday-Friday:** Leader plans roster for next week
4. **Anytime:** Check staff schedules

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Database:** PostgreSQL (Railway)
- **Data Source:** Google Apps Script
- **Hosting:** Railway
- **Version Control:** GitHub

---

## 📚 Documentation

- `APPS_SCRIPT_SETUP.md` - Set up Google Apps Script
- `AUTOMATIC_SYNC_SETUP.md` - Configure hourly auto-sync
- `WEEK_BASED_WORKFLOW.md` - How the week-based planning works
- `DATA_FLOW_EXPLAINED.md` - Understanding the data pipeline
- `RAILWAY_POSTGRES_SETUP.md` - PostgreSQL setup on Railway
- `FINAL_SETUP_COMPLETE.md` - System overview and usage

---

## 🏗 Development

### Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Apps Script URL

# Run development server
npm run dev
```

Open http://localhost:3000

### Environment Variables

```bash
# Google Apps Script Web App URL
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/.../exec

# Database (auto-provided by Railway)
DATABASE_URL=postgresql://...
```

### Deploy to Railway

1. Connect GitHub repository to Railway
2. Add PostgreSQL database
3. Railway auto-deploys on every push to main

---

## 📱 For Warehouse Leaders

**Your URL:** https://warehouse-roster-system-production.up.railway.app/leader

**How to use:**
1. **Plan Roster tab:** Tap dates, select staff, save
2. **Check Staff tab:** Tap staff names to see their schedules

Simple and mobile-friendly!

---

## 🔧 Troubleshooting

### "Failed to process data"
- Check Apps Script Web App URL is correct
- Verify Google Sheet has data
- Check Railway logs for details

### Staff not showing
- Process data in Admin Panel first
- Verify DATABASE_URL is set in Railway

### Roster not saving
- Check PostgreSQL database is connected
- Check Railway deployment logs

---

## 📞 Support

For issues:
1. Check Railway deployment logs
2. Verify PostgreSQL connection
3. Check Google Apps Script is running

---

## ✨ System Complete

All features working:
- ✅ Staff availability tracking
- ✅ Roster planning
- ✅ Staff schedule lookup  
- ✅ Mobile-friendly interface
- ✅ Data persistence
- ✅ Auto-deployment

**Enjoy your new roster system!** 🎊
