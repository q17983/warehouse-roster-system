'use client';

import { useState, useEffect } from 'react';
import styles from './StaffManagement.module.css';

interface Staff {
  id: number;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
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

  const startEdit = (staff: Staff) => {
    setEditingId(staff.id);
    setEditName(staff.name);
    setEditPhone(staff.phone || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPhone('');
  };

  const saveEdit = async () => {
    if (!editingId || !editName.trim()) {
      alert('Name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/staff/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim() || undefined,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadStaff();
        cancelEdit();
        alert('Staff updated successfully!');
      } else {
        alert(data.message || 'Failed to update staff');
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Failed to update staff');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}? This will also remove all their availability and roster assignments.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await loadStaff();
        alert('Staff deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete staff');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter(staff =>
    staff.name.toLowerCase().includes(filter.toLowerCase()) ||
    (staff.phone && staff.phone.includes(filter))
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Manage Staff</h2>
        <p className={styles.subtitle}>Edit names, fix phone numbers, or remove duplicates</p>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.staffList}>
        {filteredStaff.length === 0 ? (
          <div className={styles.empty}>No staff found</div>
        ) : (
          filteredStaff.map((staff) => (
            <div key={staff.id} className={styles.staffCard}>
              {editingId === staff.id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Name"
                    className={styles.editInput}
                    disabled={loading}
                  />
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Phone (optional)"
                    className={styles.editInput}
                    disabled={loading}
                  />
                  <div className={styles.editActions}>
                    <button
                      onClick={cancelEdit}
                      className={styles.cancelBtn}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className={styles.saveBtn}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{staff.name}</div>
                    {staff.phone && (
                      <div className={styles.staffPhone}>{staff.phone}</div>
                    )}
                  </div>
                  <div className={styles.staffActions}>
                    <button
                      onClick={() => startEdit(staff)}
                      className={styles.editButton}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id, staff.name)}
                      className={styles.deleteButton}
                      disabled={loading}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div className={styles.infoBox}>
        <h3>Common Issues & Solutions:</h3>
        <ul>
          <li><strong>Duplicate submissions:</strong> The system automatically deduplicates by exact name match. If someone submits twice with same name, only the latest phone number is kept.</li>
          <li><strong>Wrong name (typos):</strong> Use "Edit" to fix the name. The system will update all their availability and roster assignments.</li>
          <li><strong>Wrong phone number:</strong> Use "Edit" to correct it. New form submissions will also update phone numbers if the name matches.</li>
          <li><strong>Name variations:</strong> If someone appears twice (e.g., "John" and "John Smith"), manually delete one and edit the other.</li>
        </ul>
      </div>
    </div>
  );
}

