# 📦 Create Volume in Railway Dashboard (Simple Guide)

Since the CLI isn't cooperating, let's create the volume through Railway's web interface.

---

## 🎯 Step-by-Step Instructions

### Step 1: Go to Railway Dashboard
Open: https://railway.app/dashboard

### Step 2: Find Your Project
Click on: **warehouse-roster-system**

### Step 3: Click on Your Service
You should see your deployed service (might just say "web" or have a service name)
Click on it

### Step 4: Look for Volumes

**Try these locations IN ORDER:**

#### A. Settings Tab (Most Common)
1. Click **"Settings"** tab (top menu)
2. **Scroll ALL the way down** to the very bottom
3. Look for a section called:
   - "Volumes" or
   - "Storage" or  
   - "Persistent Volumes"
4. If you see it → Click **"+ Add Volume"** or **"New Volume"**

#### B. Data Tab
1. Look for a **"Data"** tab in the top menu
2. Click it
3. Look for **"+ Add Volume"** button

#### C. Three-Dot Menu
1. Look for a **three-dot menu (•••)** on your service card
2. Click it
3. Look for **"Add Volume"** or **"Storage"** option

#### D. Service Overview
1. On the service main page (overview)
2. Look for a **"+ Add"** button or **"Resources"** section
3. Check if there's a "Volume" option

---

## 🔧 If You Find the Volume Option

When you find the "Add Volume" or "New Volume" button:

1. **Click it**
2. **Fill in:**
   - **Name:** `data` (or `roster-db`)
   - **Mount Path:** `/data`
   - **Size:** 1 GB (or whatever minimum is available)
3. **Click "Create"** or **"Add"**

That's it! Railway will automatically redeploy.

---

## 📸 What to Look For

The Volumes section usually looks like:

```
┌─────────────────────────────────────┐
│  Volumes                            │
│  ─────────────────────────────────  │
│  Add persistent storage to your     │
│  service                            │
│                                     │
│  [+ New Volume]                     │
└─────────────────────────────────────┘
```

Or:

```
Storage
├── No volumes configured
└── [+ Add Volume]
```

---

## ❌ If You CAN'T Find Volumes Anywhere

### Option 1: Take Screenshots
1. Take a screenshot of your **Service Settings page**
2. Take a screenshot of your **Service Overview page**
3. Share them with me - I can help point out where to look

### Option 2: Check Your Plan
1. Railway Dashboard → Profile → **Billing** or **Usage**
2. Check what plan you're on
3. Volumes might require:
   - Trial plan with credit card, or
   - Hobby plan ($5/month), or
   - Pro plan

### Option 3: Contact Railway
**Discord:** https://discord.gg/railway (fastest)
**Email:** support@railway.app

Ask: "How do I create a persistent volume for my service? I can't find the option in the dashboard."

---

## 🧪 After Creating the Volume

Once you've created the volume:

1. **Wait 3-5 minutes** for Railway to redeploy
2. **Check the logs:**
   - Railway → Deployments → Latest → View Logs
   - Look for: `[Database] Directory exists: true`
3. **Go to Admin Panel:**
   - Click **"Process Data"**
   - Wait for success
4. **Go to Leader Page:**
   - Assign staff to a date
   - Click **"Save"**
5. **Check Debug:**
   - Visit: `https://warehouse-roster-system-production.up.railway.app/api/debug/db`
   - Should show: `rosterCount > 0`
6. **Check Staff:**
   - Click "Check Staff" tab
   - Select a staff member
   - Should show their assigned dates!

---

## 💡 Quick Tip

Sometimes the Volumes section is **hidden by default**. Try:
- Making your browser window wider
- Zooming out (Ctrl/Cmd + -)
- Checking on desktop (not mobile)

---

## What to Tell Me

After checking the dashboard, let me know:

1. ✅ **Found it!** → Where was it? (Settings tab, Data tab, etc.)
2. ❌ **Can't find it** → What tabs do you see in your service?
3. 🤷 **Not sure** → Take a screenshot and share it

I can guide you more specifically based on what you see!

