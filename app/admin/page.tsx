'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StaffManagement from './components/StaffManagement';
import styles from './admin.module.css';

export default function AdminPanel() {
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const token = sessionStorage.getItem('admin_auth');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; stats?: any; timestamp?: string } | null>(null);
  const [webAppUrl, setWebAppUrl] = useState('');
  const [csvUrl, setCsvUrl] = useState('');
  const [configLoaded, setConfigLoaded] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  // Load pre-configured URLs from environment on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (data.success) {
          // Fix URL if missing 'h' (ensure it starts with http:// or https://)
          let url = data.webAppUrl || '';
          if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            // If it starts with 'ttp' or 'ttps', add 'h'
            if (url.startsWith('ttp://')) {
              url = 'h' + url;
            } else if (url.startsWith('ttps://')) {
              url = 'h' + url;
            } else {
              // If it doesn't start with http/https at all, add https://
              url = 'https://' + url;
            }
          }
          if (url) setWebAppUrl(url);
          if (data.csvUrl) setCsvUrl(data.csvUrl);
          setConfigLoaded(true);
        }
      } catch (error) {
        console.error('Failed to load config:', error);
        setConfigLoaded(true); // Still mark as loaded to show form
      }
    };
    loadConfig();
  }, []);

  const handleClearData = async () => {
    if (!confirm('⚠️ WARNING: This will delete ALL data (staff, availability, roster) from the database!\n\nYou will need to Process Data again to reload from Google Sheet.\n\nAre you sure?')) {
      return;
    }

    setClearing(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/clear-data', {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          message: '✅ All data cleared! Click "Process Data" to reload from Google Sheet.',
        });
        // Trigger staff list reload in StaffManagement component
        window.location.reload();
      } else {
        setResult({
          success: false,
          message: data.message || 'Failed to clear data',
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Error clearing data',
      });
    } finally {
      setClearing(false);
    }
  };

  const handleProcessData = async () => {
    setProcessing(true);
    setResult(null);

    try {
      const response = await fetch('/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          webAppUrl: webAppUrl || undefined,
          csvUrl: csvUrl || undefined,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Failed to process data',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Admin Panel</h1>
            <p className={styles.subtitle}>Process Google Sheets Data</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Run "Brain" Processing</h2>
        <p className={styles.description}>
          This will fetch cleaned data from Google Apps Script and update the database. 
          You can provide either a Web App URL (Option 1) or CSV URL (Option 2), or set them in .env.local file.
        </p>

        <div className={styles.inputGroup}>
          <label htmlFor="webAppUrl">Apps Script Web App URL (Option 1 - Recommended):</label>
          <input
            id="webAppUrl"
            type="text"
            value={webAppUrl}
            onChange={(e) => setWebAppUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/..."
            className={styles.input}
          />
          <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
            {configLoaded && webAppUrl 
              ? '✓ Pre-filled from environment variable. You can edit if needed.' 
              : 'Leave empty if using environment variable APPS_SCRIPT_WEB_APP_URL'}
          </small>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="csvUrl">CSV Export URL (Option 2 - Alternative):</label>
          <input
            id="csvUrl"
            type="text"
            value={csvUrl}
            onChange={(e) => setCsvUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
            className={styles.input}
          />
          <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
            {configLoaded && csvUrl 
              ? '✓ Pre-filled from environment variable. You can edit if needed.' 
              : 'Leave empty if using environment variable GOOGLE_SHEETS_CSV_URL'}
          </small>
        </div>

        <div className={styles.buttonGroup}>
          <button
            onClick={handleProcessData}
            disabled={processing || clearing}
            className={styles.processButton}
          >
            {processing ? 'Processing...' : 'Process Data'}
          </button>

          <button
            onClick={handleClearData}
            disabled={processing || clearing}
            className={styles.clearButton}
            title="Remove all data from database (staff, availability, roster)"
          >
            {clearing ? 'Clearing...' : '🗑️ Clear All Data'}
          </button>
        </div>

        {result && (
          <div className={`${styles.result} ${result.success ? styles.success : styles.error}`}>
            <div className={styles.resultHeader}>
              {result.success ? '✓ Success' : '✗ Error'}
            </div>
            <div className={styles.resultMessage}>{result.message}</div>
            {result.stats && (
              <div className={styles.resultStats}>
                <div>Staff Processed: {result.stats.staffCount}</div>
                <div>Availability Records: {result.stats.availabilityCount}</div>
                {result.timestamp && (
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                    Last updated: {new Date(result.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Setup Instructions</h2>
        <div className={styles.instructions}>
          <h3>1. Install Google Apps Script</h3>
          <ol>
            <li>Open your Google Sheet with form responses</li>
            <li>Go to <strong>Extensions → Apps Script</strong></li>
            <li>Delete the default code</li>
            <li>Copy the entire contents of <code>google-apps-script.js</code> from this project</li>
            <li>Paste it into Apps Script editor</li>
            <li>Update the CONFIG section at the top with your sheet names</li>
            <li>Click <strong>Save</strong> (give it a name like "Roster Processor")</li>
          </ol>

          <h3>2. Set Up Automatic Processing</h3>
          <p>Choose one of two options:</p>
          
          <h4>Option 1: Web App (Recommended - Easiest)</h4>
          <ol>
            <li>In Apps Script, click <strong>Deploy → New Deployment</strong></li>
            <li>Click the gear icon ⚙️ next to "Select type" → Choose <strong>Web app</strong></li>
            <li>Set: <strong>Execute as: Me</strong></li>
            <li>Set: <strong>Who has access: Anyone</strong> (or "Anyone with Google account")</li>
            <li>Click <strong>Deploy</strong></li>
            <li>Copy the <strong>Web app URL</strong></li>
            <li>Paste it above or add to <code>.env.local</code> as <code>APPS_SCRIPT_WEB_APP_URL</code></li>
          </ol>

          <h4>Option 2: CSV Export (Alternative)</h4>
          <ol>
            <li>In Apps Script, go to <strong>Run → Trigger → Add Trigger</strong></li>
            <li>Function: <code>processFormData</code></li>
            <li>Event source: <strong>Time-driven</strong></li>
            <li>Type: <strong>Minutes timer</strong></li>
            <li>Interval: <strong>Every 5 minutes</strong> (or 15 minutes)</li>
            <li>Click <strong>Save</strong> (authorize if prompted)</li>
            <li>Make your sheet "Anyone with the link can view"</li>
            <li>Publish the "Clean_Data" sheet tab to CSV</li>
            <li>Copy the CSV URL and paste it above or add to <code>.env.local</code></li>
          </ol>

          <h3>3. Environment Variables (Optional)</h3>
          <p>Create a <code>.env.local</code> file to set defaults:</p>
          <pre className={styles.codeBlock}>
{`# Option 1: Web App URL (Recommended)
APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/...

# Option 2: CSV URL (Alternative)
GOOGLE_SHEETS_CSV_URL=https://docs.google.com/spreadsheets/d/.../export?format=csv&gid=...

# Database location
DATABASE_PATH=./roster.db`}
          </pre>

          <h3>4. Process Data</h3>
          <p>Use the form above to process your data manually, or set up automatic hourly sync (see Automatic Sync section below).</p>
          
          <h3>5. Automatic Hourly Sync (Optional)</h3>
          <p>You can set up automatic syncing so data updates every hour without manual clicks:</p>
          <ol>
            <li>See <code>AUTOMATIC_SYNC_SETUP.md</code> for detailed instructions</li>
            <li>Quick option: Add the function from <code>google-apps-script-auto-sync.js</code> to your Apps Script</li>
            <li>Set up an hourly trigger to call <code>autoSyncToWebApp()</code></li>
            <li>Or use an external cron service to call <code>/api/sync</code> endpoint</li>
          </ol>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Staff Management</h2>
        <p className={styles.description}>
          Edit staff names, fix phone numbers, or remove duplicate entries.
        </p>
        <StaffManagement />
      </div>

      <div className={styles.backLink}>
        <a href="/">← Back to Home</a>
      </div>
    </div>
  );
}

