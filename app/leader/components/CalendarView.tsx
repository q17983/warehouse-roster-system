'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, addWeeks, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import styles from './CalendarView.module.css';

interface Staff {
  id: number;
  name: string;
  phone?: string;
}

/**
 * Get the start of next week (Monday)
 */
function getNextWeekStart(): Date {
  const today = new Date();
  const thisWeekMonday = startOfWeek(today, { weekStartsOn: 1 }); // 1 = Monday
  return addWeeks(thisWeekMonday, 1);
}

export default function CalendarView() {
  // Default to next week for planning
  const [currentWeek, setCurrentWeek] = useState(getNextWeekStart());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [roster, setRoster] = useState<{ [date: string]: Staff[] }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Show next week only (Monday-Sunday, 7 days)
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6), // Monday to Sunday = 7 days
  });

  // Load roster for current week on mount
  useEffect(() => {
    loadRosterForWeek();
  }, [currentWeek]);

  const loadRosterForWeek = async () => {
    const rosterData: { [date: string]: Staff[] } = {};
    for (const day of weekDays) {
      const dateStr = format(day, 'yyyy-MM-dd');
      try {
        const response = await fetch(`/api/roster/${dateStr}`);
        const data = await response.json();
        if (data.success) {
          rosterData[dateStr] = data.roster;
        }
      } catch (error) {
        console.error('Error loading roster:', error);
      }
    }
    setRoster(rosterData);
  };

  const handleDateClick = async (date: string) => {
    setSelectedDate(date);
    setLoading(true);
    setSelectedStaffIds([]);

    try {
      // Load available staff for this date
      const response = await fetch(`/api/availability/${date}`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableStaff(data.staff);
        
        // Pre-select staff already in roster
        const existingRoster = roster[date] || [];
        setSelectedStaffIds(existingRoster.map((s: Staff) => s.id));
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      alert('Failed to load available staff');
    } finally {
      setLoading(false);
    }
  };

  const toggleStaffSelection = (staffId: number) => {
    setSelectedStaffIds(prev => 
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSave = async () => {
    if (!selectedDate) return;

    // Allow saving 0 staff (to clear assignments)
    setSaving(true);
    try {
      const response = await fetch(`/api/roster/${selectedDate}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffIds: selectedStaffIds }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local roster state
        setRoster(prev => ({
          ...prev,
          [selectedDate]: data.roster,
        }));
        
        // Close modal without alert - visual feedback is enough
        setSelectedDate(null);
      } else {
        // Only show alert on error
        alert('Failed to save roster');
      }
    } catch (error) {
      console.error('Error saving roster:', error);
      alert('Failed to save roster');
    } finally {
      setSaving(false);
    }
  };

  const getRosterForDate = (date: string): Staff[] => {
    return roster[date] || [];
  };

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1));
  };
  
  const goToNextWeek = () => {
    setCurrentWeek(getNextWeekStart());
  };

  return (
    <div className={styles.container}>
      {/* Week Navigation - Mobile Optimized */}
      <div className={styles.weekNav}>
        <button onClick={prevWeek} className={styles.navButton}>←</button>
        <div className={styles.weekInfo}>
          <div className={styles.weekLabel}>
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </div>
          {isSameDay(weekStart, getNextWeekStart()) && (
            <div className={styles.planningBadge}>📅 Planning Next Week</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isSameDay(weekStart, getNextWeekStart()) && (
            <button onClick={goToNextWeek} className={styles.jumpButton}>📍</button>
          )}
          <button onClick={nextWeek} className={styles.navButton}>→</button>
        </div>
      </div>

      {/* Vertical List of Days - Mobile First */}
      <div className={styles.daysList}>
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const assignedStaff = getRosterForDate(dateStr);
          const isToday = isSameDay(day, new Date());

          return (
            <div key={dateStr} className={`${styles.dayRow} ${isToday ? styles.today : ''}`}>
              {/* Day Header */}
              <div className={styles.dayRowHeader}>
                <div>
                  <div className={styles.dayName}>{format(day, 'EEE')}</div>
                  <div className={styles.dayDate}>{format(day, 'MMM d')}</div>
                </div>
                <div className={styles.staffCount}>{assignedStaff.length} assigned</div>
              </div>

              {/* Assigned Staff - Show ALL, scrollable if needed */}
              <div className={styles.staffContainer}>
                {assignedStaff.length > 0 ? (
                  <div className={styles.staffGrid}>
                    {assignedStaff.map((staff) => (
                      <div key={staff.id} className={styles.staffChip}>
                        {staff.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyDay}>No staff assigned</div>
                )}
              </div>

              {/* Assign Button - Large Touch Target */}
              <button
                onClick={() => handleDateClick(dateStr)}
                className={styles.assignButton}
              >
                {assignedStaff.length > 0 ? 'Edit Assignments' : 'Assign Staff'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Full-Screen Modal for iPhone */}
      {selectedDate && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDate(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{format(parseISO(selectedDate), 'EEE, MMM d')}</h2>
              <button onClick={() => setSelectedDate(null)} className={styles.closeButton}>×</button>
            </div>

            <div className={styles.modalContent}>
              {loading ? (
                <div className={styles.loading}>Loading available staff...</div>
              ) : availableStaff.length === 0 ? (
                <div className={styles.emptyState}>No staff available on this date</div>
              ) : (
                <>
                  <div className={styles.selectedCount}>
                    {selectedStaffIds.length} of {availableStaff.length} selected
                  </div>
                  <div className={styles.staffSelectionList}>
                    {availableStaff.map((staff) => (
                      <button
                        key={staff.id}
                        onClick={() => toggleStaffSelection(staff.id)}
                        className={`${styles.staffSelectItem} ${selectedStaffIds.includes(staff.id) ? styles.selected : ''}`}
                      >
                        <span className={styles.checkbox}>
                          {selectedStaffIds.includes(staff.id) ? '✓' : ''}
                        </span>
                        <span className={styles.staffName}>{staff.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setSelectedDate(null)} className={styles.cancelButton}>
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className={styles.saveButton}
                disabled={saving || selectedStaffIds.length === 0}
              >
                {saving ? 'Saving...' : `Save ${selectedStaffIds.length} Staff`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
