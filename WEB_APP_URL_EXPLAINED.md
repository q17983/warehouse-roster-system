# What is WEB_APP_SYNC_URL?

## Quick Answer

The `WEB_APP_SYNC_URL` should be your **deployed web app's URL** + `/api/sync`.

**Examples:**
- `https://your-app-name.vercel.app/api/sync`
- `https://your-domain.com/api/sync`
- `http://localhost:3000/api/sync` (only works locally, not for auto-sync)

---

## Current Situation

Right now, your app is running on **localhost** (`http://localhost:3000`), which:
- ✅ Works for manual testing
- ❌ **Doesn't work** for automatic hourly sync (Google Apps Script can't access your localhost)

---

## Solution Options

### **Option 1: Deploy Your App First (Recommended)**

Deploy your app to get a public URL, then use that:

1. **Deploy to Vercel (Easiest - Free):**
   ```bash
   npm install -g vercel
   vercel
   ```
   - Follow the prompts
   - You'll get a URL like: `https://warehouse-roster-xyz.vercel.app`
   - Use: `https://warehouse-roster-xyz.vercel.app/api/sync`

2. **Or deploy to Railway, Render, etc.**
   - Any hosting service that gives you a public URL
   - Your sync URL: `https://your-deployed-url/api/sync`

**Then in Apps Script:**
```javascript
const WEB_APP_SYNC_URL = 'https://warehouse-roster-xyz.vercel.app/api/sync';
```

---

### **Option 2: Use ngrok for Local Testing (Temporary)**

If you want to test auto-sync before deploying:

1. **Install ngrok:**
   ```bash
   # Mac
   brew install ngrok
   
   # Or download from https://ngrok.com
   ```

2. **Run ngrok:**
   ```bash
   ngrok http 3000
   ```
   
3. **Copy the ngrok URL** (looks like: `https://abc123.ngrok.io`)

4. **Use in Apps Script:**
   ```javascript
   const WEB_APP_SYNC_URL = 'https://abc123.ngrok.io/api/sync';
   ```

⚠️ **Note:** ngrok URLs change each time you restart it, so this is only for testing!

---

### **Option 3: Manual Sync for Now (No Auto-Sync)**

Until you deploy:
- Keep using the manual "Process Data" button in `/admin`
- Set up auto-sync after deployment

---

## Step-by-Step: After Deployment

Once you have your deployed URL:

1. **Copy your deployed app URL**
   - Example: `https://warehouse-roster.vercel.app`

2. **Add to Apps Script:**
   ```javascript
   function autoSyncToWebApp() {
     const WEB_APP_SYNC_URL = 'https://warehouse-roster.vercel.app/api/sync';
     // ... rest of function
   }
   ```

3. **Test it:**
   - In Apps Script, click **Run → testAutoSync**
   - Check the execution log for success/errors

4. **Set up trigger:**
   - Triggers → Add Trigger
   - Function: `autoSyncToWebApp`
   - Time-driven → Hour timer → Every hour

---

## Testing Locally (Right Now)

To test the sync endpoint locally:

```bash
curl http://localhost:3000/api/sync
```

You should see:
```json
{
  "success": true,
  "message": "Data synced successfully",
  "stats": {...}
}
```

But remember: **Apps Script can't reach localhost**, so you need a deployed URL for auto-sync!

---

## Summary

**For now:**
- ✅ Use manual "Process Data" button
- ✅ Test locally at `http://localhost:3000/api/sync`

**For automatic hourly sync:**
- 🔄 Deploy your app (Vercel, Railway, etc.)
- 🔄 Get your deployed URL
- 🔄 Use: `https://your-deployed-url/api/sync`
- 🔄 Set up Apps Script trigger

