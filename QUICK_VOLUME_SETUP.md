# ⚡ Quick Railway Volume Setup - Run These Commands

## ✅ Pre-Check: Railway CLI is Ready!

Railway CLI is available via `npx`. You're ready to go!

---

## 🚀 Step-by-Step Commands

Open your terminal and run these commands **one by one**:

### **Step 1: Login to Railway** 
```bash
cd "/Users/sai/Warehouse management"
npx @railway/cli login
```
- This will open your browser
- Click "Authorize" or "Allow"
- Come back to terminal when done

### **Step 2: Link to Your Project**
```bash
npx @railway/cli link
```
- You'll see a list of projects
- Select `warehouse-roster-system` (or type the number)
- Press Enter

### **Step 3: Create Volume** ⭐ **MOST IMPORTANT!**
```bash
npx @railway/cli volumes create data --mount /data
```
- This creates the persistent storage volume
- Wait for confirmation message

### **Step 4: Set Database Path**
```bash
npx @railway/cli variables set DATABASE_PATH="/data/roster.db"
```
- This tells the app to use the volume for database

### **Step 5: Verify It Worked**
```bash
npx @railway/cli variables
```
- Should show `DATABASE_PATH=/data/roster.db`
- If you see it, you're done! ✅

---

## 🎉 After Setup

Railway will **automatically redeploy** (takes 2-3 minutes).

### **Verify in Railway Dashboard:**
1. Go to Railway → Your Service → **Logs**
2. Look for: `[Database] Initializing database at: /data/roster.db`
3. If you see this, the volume is working! ✅

### **Test It:**
1. Process data in Admin Panel
2. Assign staff to dates
3. Click "Check Staff" → Should show scheduled dates! ✅

---

## ❓ Troubleshooting

**"Already linked":** That's fine! Skip Step 2.

**"Volume already exists":** That's fine! Skip Step 3.

**"Permission denied":** Make sure you're logged in (Step 1).

---

## 📋 Copy-Paste All Commands at Once

```bash
cd "/Users/sai/Warehouse management"
npx @railway/cli login
npx @railway/cli link
npx @railway/cli volumes create data --mount /data
npx @railway/cli variables set DATABASE_PATH="/data/roster.db"
npx @railway/cli variables
```

**Note:** Run them one at a time, wait for each to complete before running the next.

---

**Once done, your database will persist across redeploys!** 🎉

