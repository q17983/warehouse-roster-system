# Automatic Hourly Sync Setup

The system can now automatically sync data from Google Sheets every hour. Choose one of the methods below.

## Method 1: Using Google Apps Script Trigger (Easiest - Recommended)

Your Apps Script can call your web app automatically!

### Setup:

1. **Get your web app URL:**
   - When deployed, your app will have a URL like: `https://your-app.vercel.app` or `https://your-domain.com`
   - The sync endpoint is: `https://your-app-url/api/sync`

2. **Add to your Google Apps Script:**

Add this function to your `google-apps-script.js` file:

```javascript
/**
 * Automatically sync data to web app
 * This function calls your web app's sync endpoint
 */
function autoSyncToWebApp() {
  const WEB_APP_SYNC_URL = 'https://your-app-url/api/sync'; // REPLACE WITH YOUR APP URL
  
  try {
    const response = UrlFetchApp.fetch(WEB_APP_SYNC_URL, {
      method: 'GET',
      muteHttpExceptions: true
    });
    
    const result = JSON.parse(response.getContentText());
    
    if (result.success) {
      Logger.log('Auto-sync successful: ' + result.message);
      Logger.log('Staff: ' + result.stats.staffCount + ', Availability: ' + result.stats.availabilityCount);
    } else {
      Logger.log('Auto-sync failed: ' + result.message);
    }
  } catch (error) {
    Logger.log('Auto-sync error: ' + error.toString());
  }
}
```

3. **Set up hourly trigger in Apps Script:**

   - In Apps Script, go to **Triggers** (clock icon on left sidebar)
   - Click **+ Add Trigger**
   - Function: `autoSyncToWebApp`
   - Event source: **Time-driven**
   - Type: **Hour timer**
   - Interval: **Every hour**
   - Click **Save**

4. **Update the URL in the script:**
   - Replace `https://your-app-url/api/sync` with your actual deployed app URL

**Done!** Your system will now sync every hour automatically.

---

## Method 2: Using External Cron Service

Use a free cron service to call your sync endpoint hourly.

### Popular Free Cron Services:

1. **cron-job.org** (Recommended - Free)
   - Go to https://cron-job.org
   - Sign up (free)
   - Create new cron job
   - URL: `https://your-app-url/api/sync`
   - Schedule: Every 1 hour
   - Save

2. **EasyCron**
   - Go to https://www.easycron.com
   - Free tier available
   - Similar setup

3. **UptimeRobot** (Free monitoring + cron)
   - Can call your endpoint periodically
   - Free tier: 50 monitors

### Your Sync Endpoint:
```
GET or POST: https://your-app-url/api/sync
```

No authentication required (uses environment variables from your server).

---

## Method 3: Server-Side Cron (If self-hosting)

If you're running the app on your own server:

### Linux/Mac (crontab):

```bash
# Edit crontab
crontab -e

# Add this line (runs every hour at minute 0)
0 * * * * curl -s https://your-app-url/api/sync
```

### Windows (Task Scheduler):

1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily → Recur every 1 hour
4. Action: Start a program
5. Program: `curl`
6. Arguments: `https://your-app-url/api/sync`

---

## Important Notes

### **Latest Submission Only (New Behavior)**

The system now:
- ✅ **Only uses the latest submission** per staff member
- ✅ **Replaces** old availability with new (doesn't merge)
- ✅ If someone submits twice, only their latest submission counts

**Example:**
- Monday: Staff "AJ" submits available Mon-Tue
- Tuesday: Staff "AJ" submits again, now available Wed-Thu only
- **Result:** AJ is only available Wed-Thu (latest submission wins)
- **Old availability (Mon-Tue) is removed**

### **How It Works:**

1. Apps Script processes form responses in reverse order (newest first)
2. For each staff member, only their **most recent submission** is used
3. All older submissions for that staff are ignored
4. When syncing, system clears old availability and adds only latest

### **Testing Auto-Sync:**

1. Test manually first:
   ```bash
   curl https://your-app-url/api/sync
   ```
   
2. Check the response - should see:
   ```json
   {
     "success": true,
     "message": "Data synced successfully",
     "stats": {
       "staffCount": 6,
       "availabilityCount": 45
     }
   }
   ```

3. Then set up the automatic trigger

---

## Troubleshooting

**"No data source configured" error:**
- Make sure `.env.local` has your Web App URL
- Or ensure environment variables are set on your hosting platform

**Sync not running:**
- Check Apps Script execution log
- Verify the URL is correct
- Make sure your app is accessible (not just localhost)

**Data not updating:**
- Check if trigger is enabled in Apps Script
- Verify trigger execution history
- Test the sync endpoint manually first

---

## Recommended Setup Flow

1. **Deploy your app** (Vercel, Railway, etc.)
2. **Get your production URL**
3. **Update Apps Script** with the sync URL
4. **Set up hourly trigger** in Apps Script
5. **Test once manually** by calling `/api/sync`
6. **Monitor** for first few hours to ensure it works

Your data will now stay in sync automatically! 🎉

