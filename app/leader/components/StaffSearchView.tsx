'use client';

import { useState, useEffect, useRef } from 'react';
import { format, parseISO, startOfWeek, addWeeks, addDays, eachDayOfInterval } from 'date-fns';
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

// Helper to get next week start (matches calendar)
function getNextWeekStart(): Date {
  const today = new Date();
  const thisWeekMonday = startOfWeek(today, { weekStartsOn: 1 });
  return addWeeks(thisWeekMonday, 1);
}

export default function StaffSearchView() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<StaffSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(getNextWeekStart());
  const [saving, setSaving] = useState(false);
  const scheduleRef = useRef<HTMLDivElement>(null);

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
      
      if (data.success && data.staff) {
        const scheduleData = {
          ...data.staff,
          scheduledDates: data.staff.scheduledDates || [],
          availableDates: data.staff.availableDates || [],
        };
        setSchedule(scheduleData);
      } else {
        alert(`Failed to load schedule: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      alert('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);

  const handleSaveAsPhoto = async () => {
    if (!scheduleRef.current || !schedule) return;

    setSaving(true);
    try {
      // Clone the schedule card and remove elements we don't want in the photo
      const clone = scheduleRef.current.cloneNode(true) as HTMLElement;
      
      // Remove available dates section
      const availableSection = clone.querySelector('.availableSection');
      if (availableSection) {
        availableSection.remove();
      }
      
      // Remove phone number footer
      const phoneFooter = clone.querySelector('.cardFooter');
      if (phoneFooter) {
        phoneFooter.remove();
      }
      
      // Temporarily add clone to DOM for html2canvas
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      // Remove clone
      document.body.removeChild(clone);

      // Convert to data URL for display
      const dataUrl = canvas.toDataURL('image/png');
      setImageDataUrl(dataUrl);
      setShowImageModal(true);
      
      setSaving(false);
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Failed to save as photo');
      setSaving(false);
    }
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

  // Filter dates for current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });
  const weekDatesStr = weekDays.map(d => format(d, 'yyyy-MM-dd'));

  const scheduledThisWeek = schedule?.scheduledDates.filter(date => 
    weekDatesStr.includes(date)
  ) || [];

  const availableThisWeek = schedule?.availableDates.filter(date => 
    weekDatesStr.includes(date)
  ) || [];

  // Filter staff list by search
  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.phone?.includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      {/* Staff Selection Section */}
      <div className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>選擇員工</h2>
        
        {/* Search Box */}
        <input
          type="text"
          placeholder="🔍 搜尋姓名或電話..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        {/* Staff Grid - Better Layout for 20+ staff */}
        <div className={styles.staffGrid}>
          {filteredStaff.length === 0 ? (
            <div className={styles.noResults}>找不到員工</div>
          ) : (
            filteredStaff.map((staff) => (
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
            ))
          )}
        </div>
        
        <div className={styles.staffCount}>
          {filteredStaff.length} / {staffList.length} 位員工
        </div>
      </div>

      {/* Schedule Section - Week-by-Week View */}
      {selectedStaffId && (
        <div className={styles.scheduleSection}>
          {loading ? (
            <div className={styles.loading}>載入時間表中...</div>
          ) : schedule ? (
            <>
              {/* Week Navigation */}
              <div className={styles.weekNav}>
                <button onClick={prevWeek} className={styles.navButton}>
                  ←
                </button>
                <div className={styles.weekInfo}>
                  <div className={styles.weekRange}>
                    {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                  </div>
                  <button onClick={goToNextWeek} className={styles.todayButton}>
                    📅 下週
                  </button>
                </div>
                <button onClick={nextWeek} className={styles.navButton}>
                  →
                </button>
              </div>

              {/* Schedule Card - Ready for Screenshot */}
              <div ref={scheduleRef} className={styles.scheduleCard}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.staffTitle}>{schedule.name}</h2>
                  <div className={styles.weekLabel}>
                    {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                  </div>
                </div>

                {/* Scheduled Dates for This Week */}
                <div className={styles.scheduleGroup}>
                  <h3 className={styles.groupTitle}>
                    🗓️ 已安排工作 ({scheduledThisWeek.length})
                  </h3>
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

                {/* Available Dates - Show on web, hidden in photo */}
                <div className={`${styles.scheduleGroup} availableSection`}>
                  <h3 className={styles.groupTitle}>
                    ✅ 可工作 ({availableThisWeek.length})
                  </h3>
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

                {/* Footer with Contact Info - Show on web, hidden in photo */}
                {schedule.phone && (
                  <div className={`${styles.cardFooter} cardFooter`}>
                    📱 {schedule.phone}
                  </div>
                )}
              </div>

              {/* Save as Photo Button */}
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
          ) : (
            <div className={styles.emptyMessage}>選擇員工以查看其時間表</div>
          )}
        </div>
      )}

      {/* Image Modal for iPhone - Long Press to Save */}
      {showImageModal && imageDataUrl && (
        <div className={styles.imageModal} onClick={() => setShowImageModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>📸 員工時間表</h3>
              <button onClick={() => setShowImageModal(false)} className={styles.closeButton}>
                ✕
              </button>
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
