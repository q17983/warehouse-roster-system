# 🔒 Admin Password Setup

## New Features Added

1. ✅ **Password Protection** for Admin Panel
2. ✅ **Sync Button** in Leader App (🔄 icon)

---

## Set Admin Password

### On Railway:

1. **Railway Dashboard** → Your service → **Variables** tab
2. Click **"+ New Variable"**
3. **Name:** `ADMIN_PASSWORD`
4. **Value:** Your secure password (e.g., `warehouse2025`)
5. Click **Add**
6. Railway will redeploy automatically

### For Local Development:

Create or edit `.env.local` file:

```bash
ADMIN_PASSWORD=your_password_here
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/.../exec
```

---

## How It Works

### Admin Panel Access:

**Old Behavior:**
- Anyone could access `/admin`

**New Behavior:**
1. Visit `/admin` → Redirects to `/admin/login`
2. Enter password
3. Click "Login"
4. Access admin panel
5. Click "Logout" when done

### Leader App:

**New Feature:**
- **🔄 Sync button** (green circle, top-right)
- Click to sync latest data from Google Sheet
- No admin access needed!
- Leader can refresh data themselves

---

## Default Password

If you don't set `ADMIN_PASSWORD`:
- **Default:** `admin123`
- ⚠️ **Change this in production!**

---

## Usage

### For Warehouse Leader:
1. Open: `https://warehouse-roster-system-production.up.railway.app/leader`
2. Click 🔄 button to sync data (when needed)
3. Plan rosters
4. Check staff schedules
5. **No admin login needed!**

### For You (Admin):
1. Open: `https://warehouse-roster-system-production.up.railway.app/admin`
2. Enter password
3. Process data / Manage staff / Clear data
4. Logout when done

---

## Security Notes

- Password is stored in environment variable (not in code)
- Session-based (stays logged in until logout or browser close)
- Simple but effective for single-admin use
- For multiple admins, all use same password

---

## Recommended Password

Set a password that's:
- Easy for you to remember
- Not too simple (avoid "123", "password", etc.)
- Example: `warehouse2025`, `roster@2025`, `wh-admin123`

---

## After Setting Password

1. **Railway** will auto-redeploy (2-3 minutes)
2. **Visit** `/admin` → Should see login page
3. **Enter** your password
4. **Access** admin panel
5. **Leader** can use sync button in leader app (no password needed)

---

**Set the `ADMIN_PASSWORD` variable in Railway now!** ✅

