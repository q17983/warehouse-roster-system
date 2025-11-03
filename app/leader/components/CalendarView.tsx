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
  
  // AKE requirements state
  const [showAkeModal, setShowAkeModal] = useState(false);
  const [akeDate, setAkeDate] = useState<string | null>(null);
  const [msAke, setMsAke] = useState('');
  const [etAke, setEtAke] = useState('');
  const [perAke, setPerAke] = useState('');
  const [akeData, setAkeData] = useState<{ [date: string]: { ms: number; et: number; per: number; total: number } }>({});

  // Show next week only (Monday-Sunday, 7 days)
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6), // Monday to Sunday = 7 days
  });

  // Load roster and AKE data for current week
  useEffect(() => {
    loadRosterForWeek();
    loadAkeForWeek();
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

  const loadAkeForWeek = async () => {
    const akeDataMap: { [date: string]: { ms: number; et: number; per: number; total: number } } = {};
    for (const day of weekDays) {
      const dateStr = format(day, 'yyyy-MM-dd');
      try {
        const response = await fetch(`/api/ake/${dateStr}`);
        const data = await response.json();
        if (data.success && data.ake) {
          akeDataMap[dateStr] = {
            ms: data.ake.ms_ake || 0,
            et: data.ake.et_ake || 0,
            per: data.ake.per_ake || 0,
            total: data.ake.total_ake || 0,
          };
        }
      } catch (error) {
        // Ignore errors
      }
    }
    setAkeData(akeDataMap);
  };

  const handleAkeClick = async (date: string) => {
    setAkeDate(date);
    const existing = akeData[date];
    setMsAke(existing?.ms?.toString() || '');
    setEtAke(existing?.et?.toString() || '');
    setPerAke(existing?.per?.toString() || '');
    setShowAkeModal(true);
  };

  const handleSaveAke = async () => {
    if (!akeDate) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/ake/${akeDate}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msAke: msAke || '0',
          etAke: etAke || '0',
          perAke: perAke || '0',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAkeData(prev => ({
          ...prev,
          [akeDate]: {
            ms: data.ake.ms_ake,
            et: data.ake.et_ake,
            per: data.ake.per_ake,
            total: data.ake.total_ake,
          },
        }));
        setShowAkeModal(false);
      } else {
        alert('Failed to save AKE data');
      }
    } catch (error) {
      console.error('Error saving AKE:', error);
      alert('Failed to save AKE data');
    } finally {
      setSaving(false);
    }
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
            <div className={styles.planningBadge}>📅 規劃下週</div>
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
                  <div className={styles.dayName}>{format(day, 'EEE', { locale: undefined })}</div>
                  <div className={styles.dayDate}>{format(day, 'MMM d')}</div>
                </div>
                <div className={styles.staffCount}>{assignedStaff.length} 已分配</div>
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
                  <div className={styles.emptyDay}>未分配員工</div>
                )}
              </div>

              {/* AKE Requirements Display & Button */}
              <div className={styles.akeSection}>
                {akeData[dateStr] && akeData[dateStr].total > 0 ? (
                  <div className={styles.akeDisplay}>
                    <div className={styles.akeLabel}>AKE 需求:</div>
                    <div className={styles.akeValues}>
                      <span className={styles.akeItem}>MS: {akeData[dateStr].ms}</span>
                      <span className={styles.akeItem}>ET: {akeData[dateStr].et}</span>
                      <span className={styles.akeItem}>PER: {akeData[dateStr].per}</span>
                      <span className={styles.akeTotal}>總數: {akeData[dateStr].total}</span>
                    </div>
                  </div>
                ) : null}
                <button
                  onClick={() => handleAkeClick(dateStr)}
                  className={styles.akeButton}
                >
                  {akeData[dateStr] && akeData[dateStr].total > 0 ? '✏️ 編輯 AKE' : '➕ 設定 AKE'}
                </button>
              </div>

              {/* Assign Button - Large Touch Target */}
              <button
                onClick={() => handleDateClick(dateStr)}
                className={styles.assignButton}
              >
                {assignedStaff.length > 0 ? '編輯分配' : '分配員工'}
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
                <div className={styles.loading}>載入可用員工中...</div>
              ) : availableStaff.length === 0 ? (
                <div className={styles.emptyState}>此日期沒有可用員工</div>
              ) : (
                <>
                  <div className={styles.selectedCount}>
                    已選擇 {selectedStaffIds.length} / {availableStaff.length}
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
                取消
              </button>
              <button 
                onClick={handleSave} 
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? '儲存中...' : selectedStaffIds.length === 0 ? '清除分配' : `儲存 (${selectedStaffIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AKE Requirements Modal */}
      {showAkeModal && akeDate && (
        <div className={styles.modalOverlay} onClick={() => setShowAkeModal(false)}>
          <div className={styles.akeModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>設定 AKE 需求</h2>
              <button onClick={() => setShowAkeModal(false)} className={styles.closeButton}>×</button>
            </div>

            <div className={styles.akeModalContent}>
              <div className={styles.dateLabel}>
                {format(parseISO(akeDate), 'EEEE, MMM d, yyyy')}
              </div>

              {/* MS AKE */}
              <div className={styles.akeInputGroup}>
                <label>MS 馬莎 AKE</label>
                <input
                  type="number"
                  value={msAke}
                  onChange={(e) => setMsAke(e.target.value)}
                  placeholder="0"
                  min="0"
                  className={styles.akeInput}
                />
              </div>

              {/* ET AKE */}
              <div className={styles.akeInputGroup}>
                <label>ET 肯亞菜 AKE</label>
                <input
                  type="number"
                  value={etAke}
                  onChange={(e) => setEtAke(e.target.value)}
                  placeholder="0"
                  min="0"
                  className={styles.akeInput}
                />
              </div>

              {/* PER AKE */}
              <div className={styles.akeInputGroup}>
                <label>PER 鮮活 AKE</label>
                <input
                  type="number"
                  value={perAke}
                  onChange={(e) => setPerAke(e.target.value)}
                  placeholder="0"
                  min="0"
                  className={styles.akeInput}
                />
              </div>

              {/* Total Display */}
              <div className={styles.akeTotal}>
                <strong>總 AKE:</strong> {(parseInt(msAke) || 0) + (parseInt(etAke) || 0) + (parseInt(perAke) || 0)}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowAkeModal(false)} className={styles.cancelButton}>
                取消
              </button>
              <button 
                onClick={handleSaveAke} 
                className={styles.saveButton}
                disabled={saving}
              >
                {saving ? '儲存中...' : '儲存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
