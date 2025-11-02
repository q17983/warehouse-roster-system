'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from './components/CalendarView';
import StaffSearchView from './components/StaffSearchView';
import styles from './leader.module.css';

export default function LeaderApp() {
  const [activeView, setActiveView] = useState<'calendar' | 'search'>('calendar');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Roster Planning</h1>
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

