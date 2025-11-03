'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from './components/CalendarView';
import StaffSearchView from './components/StaffSearchView';
import styles from './leader.module.css';

export default function LeaderApp() {
  const [activeView, setActiveView] = useState<'calendar' | 'search'>('calendar');
  const [syncing, setSyncing] = useState(false);

  const handleSyncData = async () => {
    if (!confirm('Sync latest data from Google Sheet? This may take a few seconds.')) {
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Data synced!\n\nStaff: ${data.stats.staffCount}\nAvailability: ${data.stats.availabilityCount}`);
        window.location.reload(); // Refresh to show new data
      } else {
        alert('Failed to sync data: ' + (data.message || 'Unknown error'));
      }
    } catch (error: any) {
      alert('Error syncing data: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Roster Planning</h1>
          <button 
            onClick={handleSyncData}
            disabled={syncing}
            className={styles.syncButton}
            title="Sync latest data from Google Sheet"
          >
            {syncing ? '⏳' : '🔄'}
          </button>
        </div>
        <button 
          onClick={() => setActiveView(activeView === 'calendar' ? 'search' : 'calendar')}
          className={styles.switchButton}
        >
          {activeView === 'calendar' ? '🔍 Check Staff' : '📅 Plan Roster'}
        </button>
      </div>

      {activeView === 'calendar' ? (
        <CalendarView />
      ) : (
        <StaffSearchView />
      )}
    </div>
  );
}

