# 🔧 Manual Railway Volume Setup (Step by Step)

Since we can't install Railway CLI globally, here are manual steps you can run.

## Option 1: Use npx (No Installation Needed)

Run these commands one by one in your terminal:

### Step 1: Navigate to Project
```bash
cd "/Users/sai/Warehouse management"
```

### Step 2: Login to Railway
```bash
npx @railway/cli login
```
This will open your browser for authentication.

### Step 3: Link to Your Project
```bash
npx @railway/cli link
```
Select `warehouse-roster-system` when prompted.

### Step 4: Create Volume ⭐ **CRITICAL STEP**
```bash
npx @railway/cli volumes create data --mount /data
```
This creates the persistent volume!

### Step 5: Set Database Path
```bash
npx @railway/cli variables set DATABASE_PATH="/data/roster.db"
```

### Step 6: Verify
```bash
npx @railway/cli variables
```
Should show `DATABASE_PATH=/data/roster.db`

---

## Option 2: Use Railway Dashboard (If Available)

If Volumes section appears in Railway dashboard:

1. Go to Railway Dashboard
2. Your Project → Your Service → Settings
3. Scroll down to "Volumes" section
4. Click "New Volume"
5. Name: `data`
6. Mount Path: `/data`
7. Click "Create"
8. Then in Variables tab, set: `DATABASE_PATH=/data/roster.db`

---

## After Setup: Verify It Worked

### Check Railway Logs:
1. Railway Dashboard → Your Service → Logs
2. Look for: `[Database] Initializing database at: /data/roster.db`
3. This confirms volume is mounted!

### Test Persistence:
1. Process data in Admin Panel
2. Assign staff to dates
3. Check Staff → Should show scheduled dates ✅
4. Redeploy the service
5. Check Staff again → Data should still be there! ✅

---

## Troubleshooting

**"Command not found" or "npx not working":**
- Make sure Node.js is installed: `node --version`
- Try: `npm install -g @railway/cli` with `sudo` (on Mac/Linux)

**"Volume already exists":**
- That's okay! Skip Step 4 and just set the DATABASE_PATH variable

**"Permission denied":**
- On Mac, you might need to use `sudo` for global npm installs
- Or just use `npx` (doesn't require installation)

---

## Next Steps After Volume Setup

1. ✅ Wait 2-3 minutes for Railway to redeploy
2. ✅ Check logs to confirm database path
3. ✅ Process your data in Admin Panel
4. ✅ Assign staff to dates
5. ✅ Test "Check Staff" - should work now!

🎉 **Once volume is set up, your data will persist across redeploys!**

