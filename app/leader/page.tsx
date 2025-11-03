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
    if (!confirm('從 Google Sheet 同步最新資料？這可能需要幾秒鐘。')) {
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
        alert(`✅ 資料已同步！\n\n員工: ${data.stats.staffCount}\n可用時間記錄: ${data.stats.availabilityCount}`);
        window.location.reload(); // Refresh to show new data
      } else {
        alert('同步資料失敗: ' + (data.message || '未知錯誤'));
      }
    } catch (error: any) {
      alert('同步資料錯誤: ' + error.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>更表規劃</h1>
          <button 
            onClick={handleSyncData}
            disabled={syncing}
            className={styles.syncButton}
            title="從 Google Sheet 同步最新資料"
          >
            {syncing ? '⏳' : '🔄'}
          </button>
        </div>
        <button 
          onClick={() => setActiveView(activeView === 'calendar' ? 'search' : 'calendar')}
          className={styles.switchButton}
        >
          {activeView === 'calendar' ? '🔍 查看員工' : '📅 規劃更表'}
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

