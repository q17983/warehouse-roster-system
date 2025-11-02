'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import styles from './StaffSearchView.module.css';

interface Staff {
  id: number;
  name: string;
  phone?: string;
}

interface StaffSchedule extends Staff {
  availableDates: string[];
  scheduledDates: string[];
}

export default function StaffSearchView() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<StaffSchedule | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStaffList();
  }, []);

  const loadStaffList = async () => {
    try {
      const response = await fetch('/api/staff');
      const data = await response.json();
      
      if (data.success) {
        setStaffList(data.staff);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
      alert('Failed to load staff list');
    }
  };

  const handleStaffSelect = async (staffId: number) => {
    setSelectedStaffId(staffId);
    setLoading(true);
    setSchedule(null);

    try {
      const response = await fetch(`/api/staff/${staffId}/schedule`);
      const data = await response.json();
      
      console.log('Schedule API response:', data);
      
      if (data.success && data.staff) {
        // Ensure arrays exist (handle undefined/null)
        const scheduleData = {
          ...data.staff,
          scheduledDates: data.staff.scheduledDates || [],
          availableDates: data.staff.availableDates || [],
        };
        console.log('Setting schedule:', scheduleData);
        setSchedule(scheduleData);
      } else {
        console.error('API returned error:', data);
        alert(`Failed to load schedule: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      alert('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>Select Staff Member</h2>
        <div className={styles.staffGrid}>
          {staffList.map((staff) => (
            <button
              key={staff.id}
              onClick={() => handleStaffSelect(staff.id)}
              className={`${styles.staffCard} ${selectedStaffId === staff.id ? styles.selected : ''}`}
            >
              <div className={styles.staffName}>{staff.name}</div>
              {staff.phone && (
                <div className={styles.staffPhone}>{staff.phone}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {selectedStaffId && (
        <div className={styles.scheduleSection}>
          <h2 className={styles.sectionTitle}>
            {schedule?.name || staffList.find(s => s.id === selectedStaffId)?.name || 'Staff'}'s Schedule
          </h2>

          {loading ? (
            <div className={styles.loading}>Loading schedule...</div>
          ) : schedule ? (
            <>
              <div className={styles.scheduleGroup}>
                <h3 className={styles.groupTitle}>
                  Scheduled Dates ({schedule.scheduledDates?.length || 0})
                </h3>
                {schedule.scheduledDates && schedule.scheduledDates.length > 0 ? (
                  <div className={styles.dateList}>
                    {schedule.scheduledDates.map((date) => (
                      <div key={date} className={styles.dateBadge}>
                        {format(parseISO(date), 'EEE, MMM d, yyyy')}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyMessage}>No scheduled dates found</div>
                )}
              </div>

              <div className={styles.scheduleGroup}>
                <h3 className={styles.groupTitle}>
                  Available Dates ({schedule.availableDates?.length || 0})
                </h3>
                {schedule.availableDates && schedule.availableDates.length > 0 ? (
                  <div className={styles.dateList}>
                    {schedule.availableDates.map((date) => (
                      <div key={date} className={`${styles.dateBadge} ${styles.available}`}>
                        {format(parseISO(date), 'EEE, MMM d, yyyy')}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyMessage}>No available dates found</div>
                )}
              </div>
            </>
          ) : selectedStaffId ? (
            <div className={styles.emptyMessage}>No schedule data found for this staff member</div>
          ) : (
            <div className={styles.emptyMessage}>Select a staff member to view their schedule</div>
          )}
        </div>
      )}
    </div>
  );
}

