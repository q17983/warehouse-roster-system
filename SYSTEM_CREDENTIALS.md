# 🔑 System Credentials & Access

## Admin Panel Access

**URL:** https://warehouse-roster-system-production.up.railway.app/admin

**Login Page:** https://warehouse-roster-system-production.up.railway.app/admin/login

**Password:** `admin123`

---

## Leader App Access

**URL:** https://warehouse-roster-system-production.up.railway.app/leader

**Password:** None (no login required)

---

## Google Apps Script

**Web App URL:** 
```
https://script.google.com/macros/s/AKfycbzM1gtRnaTMrQDKK72sJTia0vbYI-7ocQvYAY4TGVailHzzrIrYvyKP2iGSG-82m8zA/exec
```

---

## Railway Environment Variables

**Set in Railway Dashboard → Variables:**
```
DATABASE_URL=${{ Postgres.DATABASE_URL }}
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/.../exec
ADMIN_PASSWORD=admin123
```

---

## Database Access

**Type:** PostgreSQL (Railway managed)

**Connection:** Auto-configured via `DATABASE_URL` environment variable

**Access:** Railway Dashboard → Postgres service → Database tab

---

## GitHub Repository

**URL:** https://github.com/q17983/warehouse-roster-system

**Branch:** main

**Auto-deploy:** Enabled (push to main → Railway deploys automatically)

---

## 🔒 Security Notes

**Admin Password:**
- Currently: `admin123`
- Change in Railway if needed: Variables tab → Edit `ADMIN_PASSWORD`
- Used for: Admin panel access only
- Leader app: No password required

**Recommendation:**
- Keep this file secure (not shared publicly)
- Change password if security is compromised
- Admin and leader access are separate

---

## 📱 Share with Team

**For Leader:**
- URL: https://warehouse-roster-system-production.up.railway.app/leader
- No password needed
- Can use on mobile phone

**For Admin (You):**
- URL: https://warehouse-roster-system-production.up.railway.app/admin
- Password: admin123
- Use on computer/tablet for better experience

---

**⚠️ Keep this file safe - contains access credentials!**

