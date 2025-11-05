'use client';

import { useState, useEffect, useRef } from 'react';
import { format, parseISO, startOfWeek, addWeeks, addDays, eachDayOfInterval, isSameDay } from 'date-fns';
import html2canvas from 'html2canvas';
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

// Helper to get next week start
function getNextWeekStart(): Date {
  const today = new Date();
  const thisWeekMonday = startOfWeek(today, { weekStartsOn: 1 });
  return addWeeks(thisWeekMonday, 1);
}

export default function StaffSearchView() {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [staffWithData, setStaffWithData] = useState<{[staffId: number]: {available: Set<string>, scheduled: Set<string>}}>({}); 
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<StaffSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(getNextWeekStart());
  const [saving, setSaving] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  useEffect(() => {
    loadAllStaff();
  }, []);

  useEffect(() => {
    loadWeekData();
  }, [currentWeek, allStaff]);

  const loadAllStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      const data = await response.json();
      
      if (data.success) {
        setAllStaff(data.staff);
      }
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const handleCellClick = async (staffId: number, date: string, isScheduled: boolean, isAvailable: boolean) => {
    if (!isAvailable && !isScheduled) {
      alert('此員工在這天不可工作');
      return;
    }

    // Optimistic update - update UI immediately
    setStaffWithData(prev => {
      const updated = { ...prev };
      if (isScheduled) {
        updated[staffId].scheduled.delete(date);
      } else {
        updated[staffId].scheduled.add(date);
      }
      return updated;
    });

    try {
      // Get current roster in background
      const response = await fetch(`/api/roster/${date}`);
      const data = await response.json();
      
      if (data.success) {
        let updatedStaffIds;
        if (isScheduled) {
          // Remove this staff
          updatedStaffIds = data.roster
            .filter((s: any) => s.id !== staffId)
            .map((s: any) => s.id);
        } else {
          // Add this staff
          const existingStaffIds = data.roster.map((s: any) => s.id);
          updatedStaffIds = [...existingStaffIds, staffId];
        }
        
        // Save in background (don't wait)
        fetch(`/api/roster/${date}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ staffIds: updatedStaffIds }),
        }).catch(err => {
          console.error('Background save failed:', err);
          // Revert on error
          loadWeekData();
        });
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      // Revert optimistic update
      await loadWeekData();
      alert('更新失敗');
    }
  };

  const loadWeekData = async () => {
    if (allStaff.length === 0) return;

    const dataMap: {[staffId: number]: {available: Set<string>, scheduled: Set<string>}} = {};
    
    // Initialize all staff
    allStaff.forEach(staff => {
      dataMap[staff.id] = {
        available: new Set(),
        scheduled: new Set(),
      };
    });

    // Get all week data in ONE API call (much faster!)
    const dates = weekDays.map(d => format(d, 'yyyy-MM-dd'));
    
    try {
      const response = await fetch('/api/week-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        const { availability, roster } = data.weekData;
        
        // Process availability data
        Object.entries(availability).forEach(([date, staffIds]) => {
          (staffIds as number[]).forEach(staffId => {
            if (dataMap[staffId]) {
              dataMap[staffId].available.add(date);
            }
          });
        });
        
        // Process roster data
        Object.entries(roster).forEach(([date, staffIds]) => {
          (staffIds as number[]).forEach(staffId => {
            if (dataMap[staffId]) {
              dataMap[staffId].scheduled.add(date);
            }
          });
        });
      }
    } catch (error) {
      console.error('Error loading week data:', error);
    }

    setStaffWithData(dataMap);
  };

  const handleStaffClick = async (staffId: number) => {
    setSelectedStaffId(staffId);
    setLoading(true);
    setSchedule(null);

    try {
      const response = await fetch(`/api/staff/${staffId}/schedule`);
      const data = await response.json();
      
      if (data.success && data.staff) {
        const scheduleData = {
          ...data.staff,
          scheduledDates: data.staff.scheduledDates || [],
          availableDates: data.staff.availableDates || [],
        };
        setSchedule(scheduleData);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsPhoto = async () => {
    if (!scheduleRef.current || !schedule) return;

    setSaving(true);
    try {
      const clone = scheduleRef.current.cloneNode(true) as HTMLElement;
      
      const availableSection = clone.querySelector('.availableSection');
      if (availableSection) availableSection.remove();
      
      const phoneFooter = clone.querySelector('.cardFooter');
      if (phoneFooter) phoneFooter.remove();
      
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL('image/png');
      setImageDataUrl(dataUrl);
      setShowImageModal(true);
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('儲存圖片失敗');
      setSaving(false);
    }
  };

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const prevWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(getNextWeekStart());
  };

  const weekDatesStr = weekDays.map(d => format(d, 'yyyy-MM-dd'));

  const scheduledThisWeek = schedule?.scheduledDates.filter(date => 
    weekDatesStr.includes(date)
  ) || [];

  const availableThisWeek = schedule?.availableDates.filter(date => 
    weekDatesStr.includes(date)
  ) || [];

  // Filter staff who have any data this week
  const staffInWeek = allStaff.filter(staff => {
    const data = staffWithData[staff.id];
    return data && (data.available.size > 0 || data.scheduled.size > 0);
  });

  // Calculate counts for each date
  const dateCounts = weekDays.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    let availableCount = 0;
    let scheduledCount = 0;
    
    staffInWeek.forEach(staff => {
      const data = staffWithData[staff.id];
      if (data) {
        if (data.available.has(dateStr)) availableCount++;
        if (data.scheduled.has(dateStr)) scheduledCount++;
      }
    });
    
    return { date: dateStr, available: availableCount, scheduled: scheduledCount };
  });

  return (
    <div className={styles.container}>
      {/* Week Navigation */}
      <div className={styles.weekNav}>
        <button onClick={prevWeek} className={styles.navButton}>←</button>
        <div className={styles.weekInfo}>
          <div className={styles.weekRange}>
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </div>
          <div className={styles.staffCount}>{staffInWeek.length} 位員工</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!isSameDay(weekStart, getNextWeekStart()) && (
            <button onClick={goToNextWeek} className={styles.jumpButton}>📍</button>
          )}
          <button onClick={nextWeek} className={styles.navButton}>→</button>
        </div>
      </div>

      {/* Weekly Overview Table */}
      <div className={styles.tableSection}>
        <h2 className={styles.sectionTitle}>本週員工時間表</h2>
        
        {staffInWeek.length === 0 ? (
          <div className={styles.emptyMessage}>本週沒有員工報更或被分配</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.weekTable}>
              <thead>
                <tr>
                  <th className={styles.nameHeader}>員工</th>
                  {weekDays.map((day, index) => {
                    const counts = dateCounts[index];
                    return (
                      <th key={format(day, 'yyyy-MM-dd')} className={styles.dateHeader}>
                        <div className={styles.dayName}>{format(day, 'EEE')}</div>
                        <div className={styles.dayDate}>{format(day, 'MMM d')}</div>
                        <div className={styles.dayCounts}>
                          <span className={styles.availableCountSmall}>{counts.available}</span>
                          <span className={styles.separator}>/</span>
                          <span className={styles.scheduledCountSmall}>{counts.scheduled}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {staffInWeek.map((staff) => {
                  const data = staffWithData[staff.id];
                  const staffScheduledCount = data?.scheduled.size || 0;
                  const staffAvailableCount = data?.available.size || 0;
                  
                  return (
                    <tr key={staff.id}>
                      <td className={styles.nameCell}>
                        <button 
                          onClick={() => handleStaffClick(staff.id)}
                          className={styles.staffNameButton}
                        >
                          <span className={styles.staffName}>{staff.name}</span>
                          <span className={styles.staffDayCounts}>
                            ({staffScheduledCount}/{staffAvailableCount})
                          </span>
                        </button>
                      </td>
                      {weekDays.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isScheduled = data?.scheduled.has(dateStr);
                        const isAvailable = data?.available.has(dateStr);
                        
                        return (
                          <td 
                            key={dateStr} 
                            className={`${styles.statusCell} ${(isScheduled || isAvailable) ? styles.clickable : ''}`}
                            onClick={() => (isScheduled || isAvailable) && handleCellClick(staff.id, dateStr, isScheduled, isAvailable)}
                          >
                            {isScheduled && (
                              <div className={styles.scheduledIcon}>✓</div>
                            )}
                            {isAvailable && !isScheduled && (
                              <div className={styles.availableIcon}>○</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={styles.scheduledIcon}>✓</div>
            <span>已安排工作</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.availableIcon}>○</div>
            <span>可工作</span>
          </div>
        </div>
      </div>

      {/* Staff Detail Modal (existing detail view) */}
      {selectedStaffId && schedule && (
        <div className={styles.detailModal} onClick={() => setSelectedStaffId(null)}>
          <div className={styles.detailContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailHeader}>
              <h2>{schedule.name} 的時間表</h2>
              <button onClick={() => setSelectedStaffId(null)} className={styles.closeButton}>×</button>
            </div>

            {loading ? (
              <div className={styles.loading}>載入中...</div>
            ) : (
              <>
                <div ref={scheduleRef} className={styles.scheduleCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.staffTitle}>{schedule.name}</h3>
                    <div className={styles.weekLabel}>
                      {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                    </div>
                  </div>

                  <div className={styles.scheduleGroup}>
                    <h4 className={styles.groupTitle}>🗓️ 已安排工作 ({scheduledThisWeek.length})</h4>
                    {scheduledThisWeek.length > 0 ? (
                      <div className={styles.dateList}>
                        {scheduledThisWeek.map((date) => (
                          <div key={date} className={styles.scheduledBadge}>
                            {format(parseISO(date), 'EEE, MMM d')}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyMessage}>本週沒有安排工作日期</div>
                    )}
                  </div>

                  <div className={`${styles.scheduleGroup} availableSection`}>
                    <h4 className={styles.groupTitle}>✅ 可工作 ({availableThisWeek.length})</h4>
                    {availableThisWeek.length > 0 ? (
                      <div className={styles.dateList}>
                        {availableThisWeek.map((date) => (
                          <div key={date} className={styles.availableBadge}>
                            {format(parseISO(date), 'EEE, MMM d')}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyMessage}>本週沒有可工作日期</div>
                    )}
                  </div>

                  {schedule.phone && (
                    <div className={`${styles.cardFooter} cardFooter`}>
                      📱 {schedule.phone}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveAsPhoto}
                  disabled={saving}
                  className={styles.savePhotoButton}
                >
                  {saving ? '⏳ 儲存中...' : '📸 儲存為圖片'}
                </button>
                <p className={styles.hint}>
                  點擊建立圖片，然後長按圖片並儲存到相簿
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Modal for iPhone */}
      {showImageModal && imageDataUrl && (
        <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>📸 員工時間表</h3>
              <button onClick={() => setShowImageModal(false)} className={styles.closeButton}>✕</button>
            </div>
            
            <div className={styles.imageContainer}>
              <img 
                src={imageDataUrl} 
                alt="員工時間表"
                className={styles.scheduleImage}
              />
            </div>
            
            <div className={styles.modalInstructions}>
              <p><strong>iPhone:</strong> 長按圖片 → "加入相片"</p>
              <p><strong>Android:</strong> 長按圖片 → "下載圖片"</p>
              <p>然後從相簿透過 WhatsApp 分享</p>
            </div>
            
            <button onClick={() => setShowImageModal(false)} className={styles.doneButton}>
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
