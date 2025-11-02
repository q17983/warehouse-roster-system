/**
 * ADD THIS FUNCTION TO YOUR EXISTING google-apps-script.js
 * 
 * This function automatically syncs data to your web app every hour
 * 
 * SETUP:
 * 1. Replace YOUR_APP_URL below with your deployed app URL (e.g., https://your-app.vercel.app)
 * 2. Go to Triggers → Add Trigger
 * 3. Function: autoSyncToWebApp
 * 4. Event source: Time-driven
 * 5. Type: Hour timer
 * 6. Interval: Every hour
 */

/**
 * Automatically sync data to web app (call this every hour)
 * This replaces manual "Process Data" button clicks
 */
function autoSyncToWebApp() {
  // ⚠️ REPLACE THIS WITH YOUR ACTUAL DEPLOYED APP URL
  const WEB_APP_SYNC_URL = 'https://YOUR_APP_URL/api/sync';
  
  try {
    Logger.log('Starting automatic sync...');
    
    // Call your web app's sync endpoint
    const response = UrlFetchApp.fetch(WEB_APP_SYNC_URL, {
      method: 'GET',
      muteHttpExceptions: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    if (statusCode === 200) {
      const result = JSON.parse(responseText);
      
      if (result.success) {
        Logger.log('✅ Auto-sync successful!');
        Logger.log('Staff: ' + result.stats.staffCount);
        Logger.log('Availability: ' + result.stats.availabilityCount);
        Logger.log('Timestamp: ' + result.timestamp);
      } else {
        Logger.log('❌ Auto-sync failed: ' + result.message);
      }
    } else {
      Logger.log('❌ HTTP Error ' + statusCode + ': ' + responseText);
    }
  } catch (error) {
    Logger.log('❌ Auto-sync error: ' + error.toString());
  }
}

/**
 * Test the sync function manually (Run → testAutoSync)
 */
function testAutoSync() {
  autoSyncToWebApp();
}

